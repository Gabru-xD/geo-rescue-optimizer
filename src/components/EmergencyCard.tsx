
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

type EmergencyCardProps = {
  incident: Incident;
  compact?: boolean;
};

const EmergencyCard: React.FC<EmergencyCardProps> = ({ incident, compact = false }) => {
  const { setActiveIncident } = useEmergency();
  
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
      <div 
        className="p-4 border rounded-lg bg-card hover:shadow-md transition-all duration-200 cursor-pointer animate-fade-in-up"
        onClick={() => setActiveIncident(incident)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-sm">{incident.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{incident.location.address}</p>
          </div>
          <span className={`status-chip priority-${incident.priority}`}>
            {incident.priority}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center">
            {getStatusIcon()}
            <span className="ml-1 capitalize">{incident.status.replace('_', ' ')}</span>
          </div>
          <div>{formattedTime}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg p-5 bg-card animate-scale-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold">{incident.title}</h2>
          <p className="text-muted-foreground">{incident.type}</p>
        </div>
        <span className={`status-chip priority-${incident.priority}`}>
          {incident.priority}
        </span>
      </div>
      
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
        <div className="space-y-2">
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
    </div>
  );
};

export default EmergencyCard;
