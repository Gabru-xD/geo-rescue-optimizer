
import React from 'react';
import { EmergencyProvider } from './context/EmergencyContext';
import { Toaster } from 'sonner';
import Sidebar from './components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IncidentForm from './components/IncidentForm';
import ResourceAllocation from './components/ResourceAllocation';
import Map from './components/Map';
import EmergencyCard from './components/EmergencyCard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AIInsights from './components/AIInsights';
import './App.css';

function App() {
  return (
    <EmergencyProvider>
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Map />
              <EmergencyCard />
            </div>
            
            <Tabs defaultValue="dashboard">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="report">Report Incident</TabsTrigger>
                <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
                <TabsTrigger value="ai">AI Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="mt-6">
                <AnalyticsDashboard />
              </TabsContent>
              
              <TabsContent value="report" className="mt-6">
                <div className="max-w-md">
                  <IncidentForm />
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="mt-6">
                <ResourceAllocation />
              </TabsContent>
              
              <TabsContent value="ai" className="mt-6">
                <AIInsights />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <Toaster position="top-right" />
    </EmergencyProvider>
  );
}

export default App;
