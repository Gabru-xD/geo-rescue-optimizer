
import React from 'react';
import Map from '../components/Map';
import EmergencyCard from '../components/EmergencyCard';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IncidentForm from '../components/IncidentForm';
import ResourceAllocation from '../components/ResourceAllocation';
import AIInsights from '../components/AIInsights';

const Dashboard = () => {
  return (
    <div className="p-6 animate-fade-in">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-3xl font-bold mb-8">Emergency Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass-effect rounded-lg p-1">
            <Map />
          </div>
          <EmergencyCard />
        </div>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="report">Report Incident</TabsTrigger>
            <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="report" className="mt-6">
            <div className="glass-effect rounded-lg p-6 max-w-md">
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
    </div>
  );
};

export default Dashboard;
