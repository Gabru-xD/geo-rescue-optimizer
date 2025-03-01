
import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AIInsights from '../components/AIInsights';

const AnalyticsPage = () => {
  return (
    <div className="p-6 animate-fade-in">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsDashboard />
          </div>
          
          <div>
            <AIInsights />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
