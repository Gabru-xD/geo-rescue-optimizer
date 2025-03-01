
import React from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { Button } from '@/components/ui/button';
import { Zap, Truck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResourceType } from '../types';

const ResourceAllocation = () => {
  const { 
    resources, 
    activeIncident,
    optimizeResourceAllocation,
    assignResource,
    unassignResource,
    getAvailableResources 
  } = useEmergency();
  
  const availableResources = getAvailableResources();
  
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'ambulance':
        return <AlertCircle className="h-4 w-4" />;
      case 'police':
        return <AlertCircle className="h-4 w-4" />;
      case 'fire_truck':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Truck className="h-4 w-4" />;
    }
  };
  
  const resourceTypeLabels: Record<ResourceType, string> = {
    ambulance: 'Ambulance',
    fire_truck: 'Fire Truck',
    police: 'Police Unit',
    hazmat: 'HazMat Team',
    rescue: 'Rescue Team'
  };
  
  if (!activeIncident) {
    return (
      <div className="border rounded-lg p-5 bg-card h-full flex flex-col items-center justify-center text-center animate-fade-in">
        <Truck className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Active Incident Selected</h3>
        <p className="text-muted-foreground max-w-md">
          Select an incident from the map or incident list to manage resource allocation.
        </p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg p-5 bg-card h-full animate-scale-in">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">Resource Allocation</h2>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 text-xs"
          onClick={() => activeIncident && optimizeResourceAllocation(activeIncident.id)}
        >
          <Zap className="h-3 w-3" />
          Auto-Optimize
        </Button>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Assigned Resources</h3>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
          {activeIncident.assignedResources.length > 0 ? (
            activeIncident.assignedResources.map(resource => (
              <div 
                key={resource.id} 
                className="bg-muted p-3 rounded-md text-sm flex justify-between items-center"
              >
                <div className="flex items-center">
                  {getResourceIcon(resource.type)}
                  <div className="ml-2">
                    <div>{resource.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {resourceTypeLabels[resource.type]}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 text-xs hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => unassignResource(activeIncident.id, resource.id)}
                >
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
              No resources assigned to this incident yet.
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Available Resources</h3>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
          {availableResources.length > 0 ? (
            availableResources.map(resource => (
              <div 
                key={resource.id} 
                className="bg-muted p-3 rounded-md text-sm flex justify-between items-center transition-colors hover:bg-muted/80"
              >
                <div className="flex items-center">
                  {getResourceIcon(resource.type)}
                  <div className="ml-2">
                    <div>{resource.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {resourceTypeLabels[resource.type]}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => assignResource(activeIncident.id, resource.id)}
                >
                  Assign
                </Button>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
              No available resources at the moment.
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Allocation Efficiency</div>
          <div className="text-xs text-muted-foreground">Auto-optimized</div>
        </div>
        
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-emergency-low"
            style={{ width: `${Math.min(100, activeIncident.assignedResources.length * 33)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <div>Understaffed</div>
          <div>Optimal</div>
          <div>Overstaffed</div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;
