
import { Incident, Resource, AnalyticsData } from '../types';

// Generate random coordinates within a given radius around a center point
const generateRandomPoint = (
  centerLat: number,
  centerLng: number,
  radiusKm: number
): { latitude: number; longitude: number } => {
  // Earth's radius in kilometers
  const earthRadius = 6371;
  
  // Convert radius from kilometers to radians
  const radiusInRadians = radiusKm / earthRadius;
  
  // Convert latitude and longitude to radians
  const centerLatRad = (centerLat * Math.PI) / 180;
  const centerLngRad = (centerLng * Math.PI) / 180;
  
  // Generate a random distance within the radius
  const randomDistance = Math.random() * radiusInRadians;
  
  // Generate a random angle in radians
  const randomAngle = Math.random() * 2 * Math.PI;
  
  // Calculate the random point's latitude and longitude in radians
  const randomLatRad = Math.asin(
    Math.sin(centerLatRad) * Math.cos(randomDistance) +
    Math.cos(centerLatRad) * Math.sin(randomDistance) * Math.cos(randomAngle)
  );
  
  const randomLngRad = centerLngRad + Math.atan2(
    Math.sin(randomAngle) * Math.sin(randomDistance) * Math.cos(centerLatRad),
    Math.cos(randomDistance) - Math.sin(centerLatRad) * Math.sin(randomLatRad)
  );
  
  // Convert back to degrees
  const randomLat = (randomLatRad * 180) / Math.PI;
  const randomLng = (randomLngRad * 180) / Math.PI;
  
  return { latitude: randomLat, longitude: randomLng };
};

// Mock resource data
export const mockResources: Resource[] = [
  {
    id: 'r1',
    type: 'ambulance',
    name: 'Ambulance A-1',
    status: 'available',
    coordinates: { latitude: 37.7858, longitude: -122.4064 },
    capacity: 2,
  },
  {
    id: 'r2',
    type: 'ambulance',
    name: 'Ambulance A-2',
    status: 'available',
    coordinates: { latitude: 37.7859, longitude: -122.4074 },
    capacity: 2,
  },
  {
    id: 'r3',
    type: 'fire_truck',
    name: 'Fire Engine F-1',
    status: 'available',
    coordinates: { latitude: 37.7872, longitude: -122.4090 },
    capacity: 6,
  },
  {
    id: 'r4',
    type: 'police',
    name: 'Police Unit P-1',
    status: 'available',
    coordinates: { latitude: 37.7835, longitude: -122.4096 },
    capacity: 4,
  },
  {
    id: 'r5',
    type: 'police',
    name: 'Police Unit P-2',
    status: 'available',
    coordinates: { latitude: 37.7845, longitude: -122.4055 },
    capacity: 4,
  },
  {
    id: 'r6',
    type: 'hazmat',
    name: 'Hazmat Team H-1',
    status: 'available',
    coordinates: { latitude: 37.7899, longitude: -122.4033 },
    capacity: 3,
  },
  {
    id: 'r7',
    type: 'rescue',
    name: 'Rescue Team R-1',
    status: 'available',
    coordinates: { latitude: 37.7891, longitude: -122.4021 },
    capacity: 5,
  },
  {
    id: 'r8',
    type: 'ambulance',
    name: 'Ambulance A-3',
    status: 'en_route',
    coordinates: { latitude: 37.7855, longitude: -122.4015 },
    capacity: 2,
    eta: 5,
  },
  {
    id: 'r9',
    type: 'fire_truck',
    name: 'Fire Engine F-2',
    status: 'available',
    coordinates: { latitude: 37.7865, longitude: -122.4030 },
    capacity: 6,
  },
  {
    id: 'r10',
    type: 'police',
    name: 'Police Unit P-3',
    status: 'available',
    coordinates: { latitude: 37.7840, longitude: -122.4050 },
    capacity: 4,
  },
];

// Incident types and their corresponding default priorities
const incidentTypes = [
  { type: 'Medical Emergency', defaultPriority: 'high' },
  { type: 'Traffic Accident', defaultPriority: 'medium' },
  { type: 'Fire', defaultPriority: 'critical' },
  { type: 'Natural Disaster', defaultPriority: 'critical' },
  { type: 'Hazardous Material', defaultPriority: 'high' },
  { type: 'Public Disturbance', defaultPriority: 'low' },
  { type: 'Structure Collapse', defaultPriority: 'critical' },
  { type: 'Missing Person', defaultPriority: 'medium' },
  { type: 'Power Outage', defaultPriority: 'low' },
];

// Generate random date within the last 30 days
const getRandomRecentDate = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime).toISOString();
};

// Generate address for a location
const getAddressForLocation = (lat: number, lng: number) => {
  const streets = [
    'Main St', 'Oak Ave', 'Maple Rd', 'Pine St', 'Cedar Dr',
    'Market St', 'Broadway', 'Park Ave', 'Mission St', 'Valencia St',
  ];
  
  const neighborhoods = [
    'Downtown', 'Uptown', 'Midtown', 'West End', 'East Side',
    'SoMa', 'Financial District', 'Mission District', 'Hayes Valley', 'Richmond',
  ];
  
  const streetNumber = Math.floor(Math.random() * 2000) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
  
  return `${streetNumber} ${street}, ${neighborhood}, San Francisco`;
};

// Generate mock incidents
export const generateMockIncidents = (count: number): Incident[] => {
  const incidents: Incident[] = [];
  
  // Center coordinates (San Francisco)
  const centerLat = 37.7749;
  const centerLng = -122.4194;
  
  for (let i = 0; i < count; i++) {
    const incidentType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    const coordinates = generateRandomPoint(centerLat, centerLng, 5);
    const address = getAddressForLocation(coordinates.latitude, coordinates.longitude);
    
    const reportedTime = getRandomRecentDate();
    const randomAssignedResources = mockResources
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map(resource => ({
        ...resource,
        status: 'dispatched' as const,
      }));
    
    incidents.push({
      id: `incident-${i + 1}`,
      title: `${incidentType.type} at ${address.split(',')[0]}`,
      description: `Reported ${incidentType.type.toLowerCase()} requiring immediate attention.`,
      type: incidentType.type,
      priority: incidentType.defaultPriority as any,
      status: Math.random() > 0.7 ? 'resolved' : (Math.random() > 0.5 ? 'in_progress' : 'dispatched'),
      location: {
        address,
        coordinates,
      },
      reportedTime,
      estimatedResponseTime: Math.floor(Math.random() * 15) + 1,
      assignedResources: randomAssignedResources,
      affectedPeople: Math.floor(Math.random() * 10),
      updates: [
        {
          timestamp: reportedTime,
          message: `${incidentType.type} reported. Dispatching nearest units.`,
          author: 'System',
        },
        {
          timestamp: new Date(new Date(reportedTime).getTime() + 5 * 60000).toISOString(),
          message: `Units dispatched to the scene.`,
          author: 'Dispatch',
        },
      ],
    });
  }
  
  return incidents;
};

// Generate mock analytics data
export const generateMockAnalytics = (): AnalyticsData => {
  // Mock incident count by type
  const incidentsByType = incidentTypes.map(type => ({
    type: type.type,
    count: Math.floor(Math.random() * 50) + 5,
  }));
  
  // Mock average response times by priority
  const responseTimesByPriority = [
    { priority: 'low' as const, averageTime: Math.floor(Math.random() * 20) + 10 },
    { priority: 'medium' as const, averageTime: Math.floor(Math.random() * 10) + 5 },
    { priority: 'high' as const, averageTime: Math.floor(Math.random() * 5) + 3 },
    { priority: 'critical' as const, averageTime: Math.floor(Math.random() * 3) + 1 },
  ];
  
  // Mock incidents by month for the last 6 months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const incidentsByMonth = months.map(month => ({
    month,
    count: Math.floor(Math.random() * 100) + 20,
  }));
  
  // Mock resource utilization
  const resourceTypes: Array<{ type: any }> = [
    { type: 'ambulance' },
    { type: 'fire_truck' },
    { type: 'police' },
    { type: 'hazmat' },
    { type: 'rescue' },
  ];
  
  const resourceUtilization = resourceTypes.map(resource => ({
    type: resource.type,
    utilization: parseFloat((Math.random() * 0.7 + 0.2).toFixed(2)),
  }));
  
  return {
    incidentsByType,
    responseTimesByPriority,
    incidentsByMonth,
    resourceUtilization,
  };
};

// Mock analytics data instance
export const mockAnalytics = generateMockAnalytics();

// Generate 15 mock incidents
export const mockIncidents = generateMockIncidents(15);
