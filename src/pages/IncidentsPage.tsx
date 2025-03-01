
import React from 'react';
import { useEmergency } from '../context/EmergencyContext';
import EmergencyCard from '../components/EmergencyCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

const IncidentsPage = () => {
  const { incidents, setActiveIncident, activeIncident } = useEmergency();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
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

  return (
    <div className="p-6 animate-fade-in">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Incidents</h1>
          <Button>New Incident</Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incidents.map(incident => (
                <Card 
                  key={incident.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    activeIncident?.id === incident.id ? 'border-primary border-2' : ''
                  }`}
                  onClick={() => setActiveIncident(incident)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{incident.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{incident.type}</p>
                      </div>
                      <Badge className={`priority-${incident.priority}`}>
                        {incident.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3 line-clamp-2">{incident.description}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(incident.status)}
                        <span className="capitalize">{incident.status.replace('_', ' ')}</span>
                      </div>
                      <span>{formatDistanceToNow(new Date(incident.reportedTime), { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="lg:sticky lg:top-6 h-fit">
            <EmergencyCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentsPage;
