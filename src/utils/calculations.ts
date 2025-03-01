
import { Incident, Resource, Coordinates, Priority } from '../types';

// Calculate distance between two coordinates using the Haversine formula
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  
  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
    Math.cos(toRad(coord2.latitude)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // in kilometers
};

// Calculate estimated time of arrival (ETA) in minutes
export const calculateETA = (distance: number, averageSpeed: number = 40): number => {
  // Using average speed in km/h, calculate time in minutes
  return Math.round((distance / averageSpeed) * 60);
};

// Get resource priority multiplier based on incident type and resource type
const getResourcePriorityMultiplier = (incidentType: string, resourceType: string): number => {
  const priorityMatrix: Record<string, Record<string, number>> = {
    'Medical Emergency': {
      ambulance: 1.0,
      police: 0.5,
      fire_truck: 0.3,
      hazmat: 0.1,
      rescue: 0.4,
    },
    'Traffic Accident': {
      ambulance: 0.8,
      police: 1.0,
      fire_truck: 0.6,
      hazmat: 0.2,
      rescue: 0.7,
    },
    'Fire': {
      ambulance: 0.5,
      police: 0.7,
      fire_truck: 1.0,
      hazmat: 0.6,
      rescue: 0.8,
    },
    'Natural Disaster': {
      ambulance: 0.7,
      police: 0.8,
      fire_truck: 0.9,
      hazmat: 0.5,
      rescue: 1.0,
    },
    'Hazardous Material': {
      ambulance: 0.4,
      police: 0.6,
      fire_truck: 0.7,
      hazmat: 1.0,
      rescue: 0.5,
    },
    'Public Disturbance': {
      ambulance: 0.3,
      police: 1.0,
      fire_truck: 0.1,
      hazmat: 0.1,
      rescue: 0.2,
    },
    'Structure Collapse': {
      ambulance: 0.6,
      police: 0.7,
      fire_truck: 0.9,
      hazmat: 0.4,
      rescue: 1.0,
    },
    'Missing Person': {
      ambulance: 0.2,
      police: 1.0,
      fire_truck: 0.3,
      hazmat: 0.1,
      rescue: 0.8,
    },
    'Power Outage': {
      ambulance: 0.3,
      police: 0.7,
      fire_truck: 0.5,
      hazmat: 0.4,
      rescue: 0.3,
    },
  };
  
  // If there's no specific mapping, return a default value
  if (!priorityMatrix[incidentType] || !priorityMatrix[incidentType][resourceType]) {
    return 0.5;
  }
  
  return priorityMatrix[incidentType][resourceType];
};

// Get priority value for calculations
const getPriorityValue = (priority: Priority): number => {
  const priorityValues: Record<Priority, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  
  return priorityValues[priority];
};

// Calculate resource allocation score for an incident-resource pair
export const calculateAllocationScore = (
  incident: Incident,
  resource: Resource
): number => {
  // Calculate distance and ETA
  const distance = calculateDistance(
    incident.location.coordinates,
    resource.coordinates
  );
  
  const eta = calculateETA(distance);
  
  // Get priority value (higher priority = higher score)
  const priorityValue = getPriorityValue(incident.priority);
  
  // Get resource relevance multiplier for this incident type
  const resourceRelevance = getResourcePriorityMultiplier(incident.type, resource.type);
  
  // Calculate final score (higher is better)
  // Formula prioritizes:
  // 1. Resources that are more relevant to the incident type
  // 2. Resources that are closer to the incident (lower ETA)
  // 3. Higher priority incidents get more relevant resources
  const etaFactor = Math.max(1, 10 - eta); // Higher for closer resources
  const score = (etaFactor * resourceRelevance * priorityValue);
  
  return parseFloat(score.toFixed(2));
};

// Find optimal resource allocation for an incident
export const findOptimalResources = (
  incident: Incident,
  availableResources: Resource[],
  maxResources: number = 3
): Resource[] => {
  // Calculate scores for each available resource
  const scoredResources = availableResources.map(resource => ({
    resource,
    score: calculateAllocationScore(incident, resource),
  }));
  
  // Sort by score (descending)
  scoredResources.sort((a, b) => b.score - a.score);
  
  // Take top N resources
  return scoredResources.slice(0, maxResources).map(item => {
    // Calculate and add ETA to the resource
    const distance = calculateDistance(
      incident.location.coordinates,
      item.resource.coordinates
    );
    
    return {
      ...item.resource,
      eta: calculateETA(distance),
    };
  });
};

// Calculate response efficiency metrics
export const calculateResponseEfficiency = (
  incidents: Incident[]
): { averageResponseTime: number; resourceUtilization: number } => {
  if (incidents.length === 0) {
    return { averageResponseTime: 0, resourceUtilization: 0 };
  }
  
  // Calculate average response time
  const totalResponseTime = incidents.reduce(
    (sum, incident) => sum + (incident.estimatedResponseTime || 0),
    0
  );
  
  const averageResponseTime = totalResponseTime / incidents.length;
  
  // Calculate resource utilization (ratio of assigned resources to total incidents)
  const totalAssignedResources = incidents.reduce(
    (sum, incident) => sum + incident.assignedResources.length,
    0
  );
  
  const maxPossibleResources = incidents.length * 3; // Assuming max 3 resources per incident
  const resourceUtilization = totalAssignedResources / maxPossibleResources;
  
  return {
    averageResponseTime: parseFloat(averageResponseTime.toFixed(1)),
    resourceUtilization: parseFloat(resourceUtilization.toFixed(2)),
  };
};
