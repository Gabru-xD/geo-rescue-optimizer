
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EmergencyProvider } from './context/EmergencyContext';
import { Toaster } from 'sonner';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import IncidentsPage from './pages/IncidentsPage';
import ResourcesPage from './pages/ResourcesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <EmergencyProvider>
      <Router>
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
          <Sidebar />
          
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        
        <Toaster position="top-right" />
      </Router>
    </EmergencyProvider>
  );
}

export default App;
