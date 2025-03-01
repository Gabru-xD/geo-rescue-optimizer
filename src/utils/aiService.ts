
import { Incident, Resource, Priority } from '../types';

// Mock AI analysis functions to simulate AI capabilities
// In a real application, these would connect to an actual AI service

/**
 * Analyzes an incident and provides response recommendations
 */
export const analyzeIncident = (incident: Incident): {
  riskLevel: number;
  expectedDuration: number;
  recommendedResources: string[];
  actionItems: string[];
} => {
  // Calculate a risk score based on incident properties
  let riskLevel = calculateRiskScore(incident);
  
  // Determine expected incident duration in hours
  const expectedDuration = estimateIncidentDuration(incident);
  
  // Generate resource recommendations
  const recommendedResources = getRecommendedResourceTypes(incident);
  
  // Generate action items
  const actionItems = generateActionItems(incident);
  
  return {
    riskLevel,
    expectedDuration,
    recommendedResources,
    actionItems
  };
};

/**
 * Calculates a risk score from 1-100 based on incident details
 */
const calculateRiskScore = (incident: Incident): number => {
  const priorityScores: Record<Priority, number> = {
    low: 10,
    medium: 40,
    high: 70,
    critical: 90
  };
  
  // Start with base score from priority
  let score = priorityScores[incident.priority];
  
  // Adjust based on incident type
  if (incident.type === 'Fire') {
    score += 10;
  } else if (incident.type === 'Hazardous Material') {
    score += 15;
  } else if (incident.type === 'Natural Disaster') {
    score += 20;
  }
  
  // Adjust based on affected people
  if (incident.affectedPeople) {
    if (incident.affectedPeople > 50) score += 15;
    else if (incident.affectedPeople > 10) score += 10;
    else if (incident.affectedPeople > 0) score += 5;
  }
  
  // Cap the score at 100
  return Math.min(score, 100);
};

/**
 * Estimates incident duration in hours
 */
const estimateIncidentDuration = (incident: Incident): number => {
  const baseDurations: Record<Priority, number> = {
    low: 1,
    medium: 3,
    high: 6,
    critical: 12
  };
  
  let duration = baseDurations[incident.priority];
  
  // Adjust based on incident type
  if (incident.type === 'Fire') {
    duration *= 1.5;
  } else if (incident.type === 'Natural Disaster') {
    duration *= 2;
  } else if (incident.type === 'Hazardous Material') {
    duration *= 1.8;
  }
  
  return Math.round(duration);
};

/**
 * Recommends resource types based on incident details
 */
const getRecommendedResourceTypes = (incident: Incident): string[] => {
  const recommendations: string[] = [];
  
  // Base recommendations based on incident type
  switch (incident.type) {
    case 'Medical Emergency':
      recommendations.push('Ambulance', 'Medical Team');
      break;
    case 'Fire':
      recommendations.push('Fire Truck', 'Firefighters', 'Water Supply');
      break;
    case 'Traffic Accident':
      recommendations.push('Police Unit', 'Ambulance', 'Tow Truck');
      break;
    case 'Natural Disaster':
      recommendations.push('Rescue Team', 'Medical Team', 'Emergency Shelter');
      break;
    case 'Hazardous Material':
      recommendations.push('HazMat Team', 'Decontamination Unit', 'Evacuation Team');
      break;
    case 'Public Disturbance':
      recommendations.push('Police Unit', 'Crowd Control');
      break;
    case 'Structure Collapse':
      recommendations.push('Rescue Team', 'Structural Engineers', 'Medical Team');
      break;
    case 'Missing Person':
      recommendations.push('Search Team', 'Police Unit', 'Drones');
      break;
    case 'Power Outage':
      recommendations.push('Utility Crew', 'Emergency Generator');
      break;
    default:
      recommendations.push('Assessment Team');
  }
  
  // Add more resources for higher priorities
  if (incident.priority === 'high' || incident.priority === 'critical') {
    recommendations.push('Command Post', 'Coordination Team');
  }
  
  return recommendations;
};

/**
 * Generates action items based on incident details
 */
const generateActionItems = (incident: Incident): string[] => {
  const actions: string[] = [
    'Establish incident perimeter',
    'Conduct initial assessment'
  ];
  
  // Add type-specific actions
  switch (incident.type) {
    case 'Medical Emergency':
      actions.push('Triage victims', 'Prepare for medical transport');
      break;
    case 'Fire':
      actions.push('Evaluate fire spread risk', 'Identify water sources', 'Plan evacuation routes');
      break;
    case 'Traffic Accident':
      actions.push('Secure accident scene', 'Manage traffic flow', 'Check for hazardous materials');
      break;
    case 'Natural Disaster':
      actions.push('Establish evacuation zones', 'Set up emergency shelters', 'Conduct damage assessment');
      break;
    case 'Hazardous Material':
      actions.push('Identify substance', 'Establish hot/warm/cold zones', 'Prepare decontamination');
      break;
    case 'Structure Collapse':
      actions.push('Search for survivors', 'Assess structural stability', 'Secure utilities');
      break;
  }
  
  // Add priority-specific actions
  if (incident.priority === 'critical') {
    actions.push('Request additional resources', 'Notify senior management');
  }
  
  return actions;
};

/**
 * Generates a natural language summary of the incident
 */
export const generateIncidentSummary = (incident: Incident): string => {
  const time = new Date(incident.reportedTime).toLocaleTimeString();
  const date = new Date(incident.reportedTime).toLocaleDateString();
  
  let summary = `A ${incident.priority} priority ${incident.type.toLowerCase()} was reported at ${time} on ${date} at ${incident.location.address}. `;
  
  if (incident.affectedPeople) {
    summary += `Approximately ${incident.affectedPeople} people are affected. `;
  }
  
  summary += `Current status is ${incident.status.replace('_', ' ')}. `;
  
  if (incident.assignedResources.length > 0) {
    summary += `${incident.assignedResources.length} resources have been assigned to this incident.`;
  } else {
    summary += `No resources have been assigned yet.`;
  }
  
  return summary;
};
