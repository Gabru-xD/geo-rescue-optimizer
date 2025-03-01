
import React, { useState } from 'react';
import { mockAnalytics } from '../utils/mockData';
import { calculateResponseEfficiency } from '../utils/calculations';
import { useEmergency } from '../context/EmergencyContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { BarChart3, Clock, Users, Zap } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#EC7063'];

const AnalyticsDashboard = () => {
  const { incidents } = useEmergency();
  const [activeTab, setActiveTab] = useState('overview');
  
  const analytics = mockAnalytics;
  const { averageResponseTime, resourceUtilization } = calculateResponseEfficiency(incidents);

  const formatToPercentage = (value: number) => `${(value * 100).toFixed(0)}%`;

  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="response">Response Times</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center">
                <div className="rounded-full p-2 bg-blue-100 mr-3">
                  <BarChart3 className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Active Incidents
                  </div>
                  <div className="text-2xl font-bold">
                    {incidents.filter(i => i.status !== 'resolved').length}
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="rounded-full p-2 bg-amber-100 mr-3">
                  <Clock className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Avg. Response Time
                  </div>
                  <div className="text-2xl font-bold">
                    {averageResponseTime} min
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="rounded-full p-2 bg-green-100 mr-3">
                  <Zap className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Resource Utilization
                  </div>
                  <div className="text-2xl font-bold">
                    {formatToPercentage(resourceUtilization)}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Incidents by Type</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.incidentsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="type"
                      label={({ type, count }) => `${type}: ${count}`}
                      labelLine={false}
                    >
                      {analytics.incidentsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Incidents Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.incidentsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="incidents" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Incidents by Type</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.incidentsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Resource Utilization</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.resourceUtilization}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis tickFormatter={formatToPercentage} />
                  <Tooltip formatter={(value) => formatToPercentage(value as number)} />
                  <Legend />
                  <Bar dataKey="utilization" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="response" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Response Times by Priority</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.responseTimesByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageTime" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
