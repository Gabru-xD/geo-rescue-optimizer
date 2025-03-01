
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Incident, Resource, EmergencyContextType } from '../types';
import { mockIncidents, mockResources } from '../utils/mockData';
import { findOptimalResources } from '../utils/calculations';
import { toast } from "sonner";

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

  // Load initial data
  useEffect(() => {
    // In a real application, this would fetch data from an API
    console.log('Emergency context initialized with mock data');
  }, []);

  // Add a new incident
  const addIncident = (incident: Incident) => {
    setIncidents(prev => [incident, ...prev]);
    toast.success(`New incident reported: ${incident.title}`);
  };

  // Update an existing incident
  const updateIncident = (id: string, updates: Partial<Incident>) => {
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
  const assignResource = (incidentId: string, resourceId: string) => {
    // Find the resource
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    // Update the resource status
    const updatedResources = resources.map(r => 
      r.id === resourceId ? { ...r, status: 'dispatched' } : r
    );
    setResources(updatedResources);
    
    // Update the incident with the assigned resource
    setIncidents(prev => 
      prev.map(incident => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            assignedResources: [...incident.assignedResources, { ...resource, status: 'dispatched' }],
          };
        }
        return incident;
      })
    );
    
    // Update active incident if necessary
    if (activeIncident && activeIncident.id === incidentId) {
      setActiveIncident({
        ...activeIncident,
        assignedResources: [...activeIncident.assignedResources, { ...resource, status: 'dispatched' }],
      });
    }
    
    toast.success(`${resource.name} assigned to incident`);
  };

  // Unassign a resource from an incident
  const unassignResource = (incidentId: string, resourceId: string) => {
    // Update the resource status
    const updatedResources = resources.map(r => 
      r.id === resourceId ? { ...r, status: 'available' } : r
    );
    setResources(updatedResources);
    
    // Update the incident
    setIncidents(prev => 
      prev.map(incident => {
        if (incident.id === incidentId) {
          return {
            ...incident,
            assignedResources: incident.assignedResources.filter(r => r.id !== resourceId),
          };
        }
        return incident;
      })
    );
    
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
  const optimizeResourceAllocation = (incidentId: string) => {
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
