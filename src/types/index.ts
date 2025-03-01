
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Status = 'pending' | 'dispatched' | 'in_progress' | 'resolved';

export type ResourceType = 'ambulance' | 'fire_truck' | 'police' | 'hazmat' | 'rescue';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Resource = {
  id: string;
  type: ResourceType;
  name: string;
  status: 'available' | 'dispatched' | 'en_route' | 'on_scene' | 'returning';
  coordinates: Coordinates;
  capacity: number;
  eta?: number;
};

export type Incident = {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: Priority;
  status: Status;
  location: {
    address: string;
    coordinates: Coordinates;
  };
  reportedTime: string;
  estimatedResponseTime?: number;
  assignedResources: Resource[];
  affectedPeople?: number;
  updates: {
    timestamp: string;
    message: string;
    author: string;
  }[];
};

export type EmergencyContextType = {
  incidents: Incident[];
  resources: Resource[];
  activeIncident: Incident | null;
  setActiveIncident: (incident: Incident | null) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  assignResource: (incidentId: string, resourceId: string) => void;
  unassignResource: (incidentId: string, resourceId: string) => void;
  getAvailableResources: () => Resource[];
  optimizeResourceAllocation: (incidentId: string) => void;
};

export type AnalyticsData = {
  incidentsByType: {
    type: string;
    count: number;
  }[];
  responseTimesByPriority: {
    priority: Priority;
    averageTime: number;
  }[];
  incidentsByMonth: {
    month: string;
    count: number;
  }[];
  resourceUtilization: {
    type: ResourceType;
    utilization: number;
  }[];
};
