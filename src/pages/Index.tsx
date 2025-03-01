
import React, { useState } from 'react';
import { EmergencyProvider } from '../context/EmergencyContext';
import Sidebar from '../components/Sidebar';
import MapComponent from '../components/Map';
import EmergencyCard from '../components/EmergencyCard';
import ResourceAllocation from '../components/ResourceAllocation';
import IncidentForm from '../components/IncidentForm';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useEmergency } from '../context/EmergencyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { 
  MapPin, 
  Clipboard, 
  BarChart3, 
  PlusCircle,
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const DashboardContent = () => {
  const { incidents, activeIncident } = useEmergency();
  const [activeTab, setActiveTab] = useState('map');
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  const activeIncidents = incidents.filter(
    incident => incident.status !== 'resolved'
  );
  
  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Emergency Response Dashboard</h1>
          <p className="text-muted-foreground">Coordinate, optimize, and track emergency responses in real-time</p>
        </div>
        
        <Button 
          onClick={() => setShowReportDialog(true)} 
          className="gap-2 bg-emergency-medium hover:bg-emergency-medium/90 text-white"
        >
          <PlusCircle className="h-4 w-4" />
          Report New Incident
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-4 pt-4 pb-0 flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="map" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Map View</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-1">
                    <Clipboard className="h-4 w-4" />
                    <span>Incident List</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="text-sm text-muted-foreground">
                  {activeIncidents.length} active incidents
                </div>
              </div>
              
              <TabsContent value="map" className="m-0">
                <div className="h-[500px] border-t">
                  <MapComponent />
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="m-0">
                <div className="h-[500px] border-t overflow-auto p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeIncidents.length > 0 ? (
                      activeIncidents.map(incident => (
                        <EmergencyCard key={incident.id} incident={incident} compact />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center h-96 text-center">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Active Incidents</h3>
                        <p className="text-muted-foreground max-w-md">
                          All incidents have been resolved or no incidents have been reported yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="m-0">
                <div className="h-[500px] border-t overflow-auto p-4">
                  <AnalyticsDashboard />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          
          {activeIncident && (
            <Card className="p-6">
              <EmergencyCard incident={activeIncident} />
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card className="h-[500px] overflow-auto">
            <ResourceAllocation />
          </Card>
        </div>
      </div>
      
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Report New Incident</DialogTitle>
          </DialogHeader>
          <IncidentForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Index = () => {
  return (
    <EmergencyProvider>
      <div className="grid-dashboard min-h-screen">
        <Sidebar />
        <main className="overflow-auto">
          <DashboardContent />
        </main>
      </div>
    </EmergencyProvider>
  );
};

export default Index;
