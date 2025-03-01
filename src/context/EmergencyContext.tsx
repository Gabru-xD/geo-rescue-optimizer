import React, { createContext, useState, useContext, useEffect } from 'react';
import { Incident, Resource, EmergencyContextType } from '../types';
import { mockIncidents, mockResources } from '../utils/mockData';
import { findOptimalResources } from '../utils/calculations';
import { toast } from "sonner";
import mongoDBService from '../services/MongoDBService';

// Create context with default values
const EmergencyContext = createContext<EmergencyContextType>({
  incidents: [],
  resources: [],
  activeIncident: null,
  setActiveIncident: () => {},
  addIncident: () => {},
  updateIncident: () => {},
  assignResource: () => {},
  unassignResource: () => {},
  getAvailableResources: () => [],
  optimizeResourceAllocation: () => {},
});

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbConnected, setDbConnected] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Try to load data from MongoDB
        const dbIncidents = await mongoDBService.getAllIncidents();
        const dbResources = await mongoDBService.getAllResources();
        
        // Check if we have data from MongoDB
        if (dbIncidents.length > 0) {
          setIncidents(dbIncidents);
          setDbConnected(true);
        }
        
        if (dbResources.length > 0) {
          setResources(dbResources);
          setDbConnected(true);
        }
        
        // If MongoDB is connected but we don't have data, seed it with mock data
        if (dbConnected && dbIncidents.length === 0) {
          // Seed incidents
          for (const incident of mockIncidents) {
            await mongoDBService.addIncident(incident);
          }
          setIncidents(mockIncidents);
        }
        
        if (dbConnected && dbResources.length === 0) {
          // Seed resources
          for (const resource of mockResources) {
            await mongoDBService.addResource(resource);
          }
          setResources(mockResources);
        }
        
        console.log('Emergency context initialized with', dbConnected ? 'MongoDB data' : 'mock data');
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to mock data
        setIncidents(mockIncidents);
        setResources(mockResources);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Cleanup function
    return () => {
      // Nothing to clean up for now
    };
  }, []);

  // Add a new incident
  const addIncident = async (incident: Incident) => {
    if (dbConnected) {
      // Add to MongoDB
      const newIncident = await mongoDBService.addIncident(incident);
      if (newIncident) {
        setIncidents(prev => [newIncident, ...prev]);
        toast.success(`New incident reported: ${incident.title}`);
      } else {
        toast.error('Failed to add incident to database');
      }
    } else {
      // Fallback to local state
      setIncidents(prev => [incident, ...prev]);
      toast.success(`New incident reported: ${incident.title}`);
    }
  };

  // Update an existing incident
  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    if (dbConnected) {
      // Update in MongoDB
      const success = await mongoDBService.updateIncident(id, updates);
      if (success) {
        setIncidents(prev => 
          prev.map(incident => 
            incident.id === id ? { ...incident, ...updates } : incident
          )
        );
        
        // Update active incident if it's the one being updated
        if (activeIncident && activeIncident.id === id) {
          setActiveIncident({ ...activeIncident, ...updates });
        }
        
        toast.info(`Incident ${id} updated`);
      } else {
        toast.error('Failed to update incident in database');
      }
    } else {
      // Fallback to local state
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === id ? { ...incident, ...updates } : incident
        )
      );
      
      // Update active incident if it's the one being updated
      if (activeIncident && activeIncident.id === id) {
        setActiveIncident({ ...activeIncident, ...updates });
      }
      
      toast.info(`Incident ${id} updated`);
    }
  };

  // Get available resources (not currently assigned to incidents)
  const getAvailableResources = (): Resource[] => {
    // Create a set of all assigned resource IDs
    const assignedResourceIds = new Set<string>();
    incidents.forEach(incident => {
      incident.assignedResources.forEach(resource => {
        assignedResourceIds.add(resource.id);
      });
    });
    
    // Filter resources that are not in the assigned set and are available
    return resources.filter(
      resource => !assignedResourceIds.has(resource.id) && resource.status === 'available'
    );
  };

  // Assign a resource to an incident
  const assignResource = async (incidentId: string, resourceId: string) => {
    // Find the resource
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    // Update the resource status
    const updatedResources = resources.map(r => 
      r.id === resourceId ? { ...r, status: 'dispatched' as const } : r
    );
    setResources(updatedResources);
    
    if (dbConnected) {
      // Update resource in MongoDB
      await mongoDBService.updateResource(resourceId, { status: 'dispatched' });
    }
    
    // Update the incident with the assigned resource
    const incidentToUpdate = incidents.find(inc => inc.id === incidentId);
    if (incidentToUpdate) {
      const updatedIncident = {
        ...incidentToUpdate,
        assignedResources: [...incidentToUpdate.assignedResources, { ...resource, status: 'dispatched' as const }],
      };
      
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId ? updatedIncident : incident
        )
      );
      
      if (dbConnected) {
        // Update incident in MongoDB
        await mongoDBService.updateIncident(incidentId, updatedIncident);
      }
    }
    
    // Update active incident if necessary
    if (activeIncident && activeIncident.id === incidentId) {
      setActiveIncident({
        ...activeIncident,
        assignedResources: [...activeIncident.assignedResources, { ...resource, status: 'dispatched' as const }],
      });
    }
    
    toast.success(`${resource.name} assigned to incident`);
  };

  // Unassign a resource from an incident
  const unassignResource = async (incidentId: string, resourceId: string) => {
    // Update the resource status
    const updatedResources = resources.map(r => 
      r.id === resourceId ? { ...r, status: 'available' as const } : r
    );
    setResources(updatedResources);
    
    if (dbConnected) {
      // Update resource in MongoDB
      await mongoDBService.updateResource(resourceId, { status: 'available' });
    }
    
    // Update the incident
    const incidentToUpdate = incidents.find(inc => inc.id === incidentId);
    if (incidentToUpdate) {
      const updatedIncident = {
        ...incidentToUpdate,
        assignedResources: incidentToUpdate.assignedResources.filter(r => r.id !== resourceId),
      };
      
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId ? updatedIncident : incident
        )
      );
      
      if (dbConnected) {
        // Update incident in MongoDB
        await mongoDBService.updateIncident(incidentId, updatedIncident);
      }
    }
    
    // Update active incident if necessary
    if (activeIncident && activeIncident.id === incidentId) {
      setActiveIncident({
        ...activeIncident,
        assignedResources: activeIncident.assignedResources.filter(r => r.id !== resourceId),
      });
    }
    
    toast.info(`Resource unassigned from incident`);
  };

  // Optimize resource allocation for an incident
  const optimizeResourceAllocation = async (incidentId: string) => {
    // Find the incident
    const incident = incidents.find(inc => inc.id === incidentId);
    if (!incident) return;
    
    // Get available resources
    const availableResources = getAvailableResources();
    
    // Find optimal resources
    const optimalResources = findOptimalResources(incident, availableResources);
    
    // Assign optimal resources
    optimalResources.forEach(resource => {
      assignResource(incidentId, resource.id);
    });
    
    toast.success(`Optimized resource allocation for incident ${incidentId}`);
  };

  // Create loading state UI component
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-lg">Loading emergency data...</p>
      </div>
    );
  }

  return (
    <EmergencyContext.Provider
      value={{
        incidents,
        resources,
        activeIncident,
        setActiveIncident,
        addIncident,
        updateIncident,
        assignResource,
        unassignResource,
        getAvailableResources,
        optimizeResourceAllocation,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

// Custom hook to use the emergency context
export const useEmergency = () => useContext(EmergencyContext);
