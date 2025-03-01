
import { MongoClient, ServerApiVersion, Collection, ObjectId } from 'mongodb';
import { Incident, Resource } from '../types';

// Interface for documents stored in MongoDB
interface IncidentDocument extends Omit<Incident, 'id'> {
  _id?: ObjectId;
}

interface ResourceDocument extends Omit<Resource, 'id'> {
  _id?: ObjectId;
}

class MongoDBService {
  private client: MongoClient | null = null;
  private incidentsCollection: Collection<IncidentDocument> | null = null;
  private resourcesCollection: Collection<ResourceDocument> | null = null;
  private isConnected: boolean = false;

  constructor() {
    // Initialize MongoDB connection when service is created
    this.init();
  }

  async init() {
    try {
      // Get MongoDB connection string from environment variable
      const uri = import.meta.env.VITE_MONGODB_URI;
      
      if (!uri) {
        console.error('MongoDB URI not provided in environment variables');
        return;
      }

      // Create a MongoClient with connection settings
      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      // Connect to MongoDB
      await this.client.connect();
      console.log('Connected to MongoDB');
      this.isConnected = true;

      // Get database and collections
      const db = this.client.db('emergency-management');
      this.incidentsCollection = db.collection<IncidentDocument>('incidents');
      this.resourcesCollection = db.collection<ResourceDocument>('resources');

      // Create geospatial indexes for vector search
      await this.createIndexes();
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
    }
  }

  private async createIndexes() {
    try {
      if (!this.incidentsCollection || !this.resourcesCollection) return;
      
      // Create geospatial index for incidents
      await this.incidentsCollection.createIndex({ 
        "location.coordinates": "2dsphere" 
      });
      
      // Create geospatial index for resources
      await this.resourcesCollection.createIndex({ 
        "coordinates": "2dsphere" 
      });
      
      console.log('Indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
    }
  }

  // Convert MongoDB document to Incident
  private documentToIncident(doc: IncidentDocument): Incident {
    const { _id, ...incidentData } = doc;
    return {
      id: _id?.toString() || '',
      ...incidentData
    };
  }

  // Convert MongoDB document to Resource
  private documentToResource(doc: ResourceDocument): Resource {
    const { _id, ...resourceData } = doc;
    return {
      id: _id?.toString() || '',
      ...resourceData
    };
  }

  // Convert Incident to MongoDB document
  private incidentToDocument(incident: Incident): IncidentDocument {
    const { id, ...incidentData } = incident;
    return incidentData;
  }

  // Convert Resource to MongoDB document
  private resourceToDocument(resource: Resource): ResourceDocument {
    const { id, ...resourceData } = resource;
    return resourceData;
  }

  // INCIDENT METHODS
  
  async getAllIncidents(): Promise<Incident[]> {
    if (!this.incidentsCollection) return [];
    
    try {
      const documents = await this.incidentsCollection.find().toArray();
      return documents.map(doc => this.documentToIncident(doc));
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return [];
    }
  }

  async getIncidentById(id: string): Promise<Incident | null> {
    if (!this.incidentsCollection) return null;
    
    try {
      const document = await this.incidentsCollection.findOne({ _id: new ObjectId(id) });
      return document ? this.documentToIncident(document) : null;
    } catch (error) {
      console.error('Error fetching incident:', error);
      return null;
    }
  }

  async addIncident(incident: Incident): Promise<Incident | null> {
    if (!this.incidentsCollection) return null;
    
    try {
      const document = this.incidentToDocument(incident);
      const result = await this.incidentsCollection.insertOne(document);
      return {
        ...incident,
        id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('Error adding incident:', error);
      return null;
    }
  }

  async updateIncident(id: string, updates: Partial<Incident>): Promise<boolean> {
    if (!this.incidentsCollection) return false;
    
    try {
      const { id: _, ...updateData } = updates;
      const result = await this.incidentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating incident:', error);
      return false;
    }
  }

  // Find incidents near a location
  async findNearbyIncidents(
    latitude: number, 
    longitude: number, 
    maxDistance: number = 10000
  ): Promise<Incident[]> {
    if (!this.incidentsCollection) return [];
    
    try {
      const documents = await this.incidentsCollection.find({
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
          }
        }
      }).toArray();
      
      return documents.map(doc => this.documentToIncident(doc));
    } catch (error) {
      console.error('Error finding nearby incidents:', error);
      return [];
    }
  }

  // RESOURCE METHODS
  
  async getAllResources(): Promise<Resource[]> {
    if (!this.resourcesCollection) return [];
    
    try {
      const documents = await this.resourcesCollection.find().toArray();
      return documents.map(doc => this.documentToResource(doc));
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
  }

  async getResourceById(id: string): Promise<Resource | null> {
    if (!this.resourcesCollection) return null;
    
    try {
      const document = await this.resourcesCollection.findOne({ _id: new ObjectId(id) });
      return document ? this.documentToResource(document) : null;
    } catch (error) {
      console.error('Error fetching resource:', error);
      return null;
    }
  }

  async addResource(resource: Resource): Promise<Resource | null> {
    if (!this.resourcesCollection) return null;
    
    try {
      const document = this.resourceToDocument(resource);
      const result = await this.resourcesCollection.insertOne(document);
      return {
        ...resource,
        id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('Error adding resource:', error);
      return null;
    }
  }

  async updateResource(id: string, updates: Partial<Resource>): Promise<boolean> {
    if (!this.resourcesCollection) return false;
    
    try {
      const { id: _, ...updateData } = updates;
      const result = await this.resourcesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating resource:', error);
      return false;
    }
  }

  // Find resources near a location - useful for emergency response allocation
  async findNearbyResources(
    latitude: number, 
    longitude: number, 
    maxDistance: number = 10000,
    type?: string
  ): Promise<Resource[]> {
    if (!this.resourcesCollection) return [];
    
    try {
      const query: any = {
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
          }
        }
      };
      
      if (type) {
        query.type = type;
      }
      
      const documents = await this.resourcesCollection.find(query).toArray();
      return documents.map(doc => this.documentToResource(doc));
    } catch (error) {
      console.error('Error finding nearby resources:', error);
      return [];
    }
  }

  // Close the MongoDB connection
  async close() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }
}

// Create a singleton instance
const mongoDBService = new MongoDBService();

export default mongoDBService;
