
import React from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, AlertCircle, Users, MapPin } from 'lucide-react';
import { ResourceType } from '../types';
import { Button } from '@/components/ui/button';
import ResourceAllocation from '../components/ResourceAllocation';

const ResourcesPage = () => {
  const { resources, activeIncident } = useEmergency();
  
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
  
  const availableResources = resources.filter(r => 
    !r.assignedToIncidentId
  );
  
  const assignedResources = resources.filter(r => 
    r.assignedToIncidentId
  );

  return (
    <div className="p-6 animate-fade-in">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Resources</h1>
          <Button>Add Resource</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Total Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{resources.length}</div>
              <p className="text-sm text-muted-foreground">Total emergency response units</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{availableResources.length}</div>
              <p className="text-sm text-muted-foreground">Resources ready for assignment</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Deployed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{assignedResources.length}</div>
              <p className="text-sm text-muted-foreground">Resources currently in the field</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resource Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(resourceTypeLabels).map(([type, label]) => {
                    const count = resources.filter(r => r.type === type).length;
                    const availableCount = availableResources.filter(r => r.type === type).length;
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getResourceIcon(type as ResourceType)}
                          <span>{label}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{availableCount}</span>
                          <span className="text-muted-foreground"> / {count} available</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <ResourceAllocation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
