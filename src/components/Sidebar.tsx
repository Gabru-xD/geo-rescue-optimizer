
import React from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { PlusCircle, BarChart3, MapPin, Truck, AlertCircle } from 'lucide-react';

const Sidebar = () => {
  const { incidents } = useEmergency();
  
  const pendingIncidents = incidents.filter(
    incident => incident.status !== 'resolved'
  ).length;

  const criticalIncidents = incidents.filter(
    incident => incident.priority === 'critical' && incident.status !== 'resolved'
  ).length;

  return (
    <aside className="h-screen w-64 flex-shrink-0 flex flex-col bg-sidebar text-sidebar-foreground p-5 border-r border-sidebar-border animate-fade-in">
      <div className="flex items-center gap-2 mb-8">
        <AlertCircle className="h-6 w-6 text-emergency-critical" />
        <h1 className="font-semibold text-xl">Geo-Rescue</h1>
      </div>
      
      <nav className="space-y-1 mb-auto">
        <NavLink to="/" className={({ isActive }) => 
          isActive 
            ? "flex items-center w-full p-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-md transition-all duration-200 group"
            : "flex items-center w-full p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-all duration-200 group"
        }>
          <MapPin className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          Dashboard
        </NavLink>
        
        <NavLink to="/incidents" className={({ isActive }) => 
          isActive 
            ? "flex items-center w-full p-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-md transition-all duration-200 group justify-between"
            : "flex items-center w-full p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-all duration-200 group justify-between"
        }>
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            Incidents
          </div>
          {pendingIncidents > 0 && (
            <span className="bg-emergency-high text-white px-2 py-0.5 rounded-full text-xs">
              {pendingIncidents}
            </span>
          )}
        </NavLink>
        
        <NavLink to="/resources" className={({ isActive }) => 
          isActive 
            ? "flex items-center w-full p-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-md transition-all duration-200 group"
            : "flex items-center w-full p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-all duration-200 group"
        }>
          <Truck className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          Resources
        </NavLink>
        
        <NavLink to="/analytics" className={({ isActive }) => 
          isActive 
            ? "flex items-center w-full p-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-md transition-all duration-200 group"
            : "flex items-center w-full p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-all duration-200 group"
        }>
          <BarChart3 className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          Analytics
        </NavLink>
      </nav>
      
      <div className="pt-8 border-t border-sidebar-border mt-4">
        <div className="bg-sidebar-accent rounded-lg p-4 mb-4">
          <h3 className="font-medium mb-1">Critical Situations</h3>
          <div className="flex items-center">
            <span className="text-2xl font-semibold">{criticalIncidents}</span>
            <span className="ml-2 text-sm opacity-70">active alerts</span>
          </div>
        </div>
        
        <Button 
          className="w-full gap-2 bg-emergency-medium hover:bg-emergency-medium/90 text-white transition-all duration-200 group"
        >
          <PlusCircle className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
          Report Incident
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
