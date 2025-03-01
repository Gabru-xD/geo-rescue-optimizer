
import React from 'react';
import { Incident } from '../types';
import { 
  CalendarClock, 
  Users, 
  MapPin, 
  AlertCircle, 
  CheckCircle2,
  Clock 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEmergency } from '../context/EmergencyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type EmergencyCardProps = {
  incident?: Incident;
  compact?: boolean;
};

const EmergencyCard: React.FC<EmergencyCardProps> = ({ incident: propIncident, compact = false }) => {
  const { setActiveIncident, activeIncident } = useEmergency();
  
  // Use provided incident prop or fall back to activeIncident from context
  const incident = propIncident || activeIncident;

  // If no incident is available, show a placeholder
  if (!incident) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
        <p className="text-muted-foreground">No incident selected.</p>
        <p className="text-muted-foreground text-sm mt-2">Select an incident from the map or report a new one.</p>
      </Card>
    );
  }
  
  const getStatusIcon = () => {
    switch (incident.status) {
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-emergency-low" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-emergency-medium" />;
      case 'dispatched':
        return <AlertCircle className="h-4 w-4 text-emergency-high" />;
      default:
        return <AlertCircle className="h-4 w-4 text-emergency-critical" />;
    }
  };
  
  const formattedTime = formatDistanceToNow(new Date(incident.reportedTime), { addSuffix: true });
  
  if (compact) {
    return (
      <Card 
        className="hover:shadow-md transition-all duration-200 cursor-pointer animate-fade-in-up"
        onClick={() => setActiveIncident(incident)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-sm">{incident.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{incident.location.address}</p>
            </div>
            <Badge className={`priority-${incident.priority}`}>
              {incident.priority}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              {getStatusIcon()}
              <span className="ml-1 capitalize">{incident.status.replace('_', ' ')}</span>
            </div>
            <div>{formattedTime}</div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{incident.title}</CardTitle>
            <p className="text-muted-foreground">{incident.type}</p>
          </div>
          <Badge className={`priority-${incident.priority}`}>
            {incident.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="mb-4">{incident.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{incident.location.address}</span>
          </div>
          
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{formattedTime}</span>
          </div>
          
          {incident.affectedPeople && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{incident.affectedPeople} affected</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">ETA: {incident.estimatedResponseTime} min</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Assigned Resources ({incident.assignedResources.length})</h3>
          {incident.assignedResources.length > 0 ? (
            <div className="space-y-2">
              {incident.assignedResources.map(resource => (
                <div key={resource.id} className="bg-muted p-2 rounded-md text-sm flex justify-between">
                  <span>{resource.name}</span>
                  <span className="text-muted-foreground capitalize">{resource.type.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No resources assigned yet.</p>
          )}
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Updates</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {incident.updates.map((update, index) => (
              <div key={index} className="text-sm border-l-2 border-muted pl-3">
                <p>{update.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(update.timestamp), { addSuffix: true })} by {update.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyCard;
