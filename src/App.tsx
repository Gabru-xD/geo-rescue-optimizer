
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EmergencyProvider } from './context/EmergencyContext';
import { Toaster, toast } from 'sonner';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import IncidentsPage from './pages/IncidentsPage';
import ResourcesPage from './pages/ResourcesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFound from './pages/NotFound';
import { validateEnv } from './config/env';
import './App.css';

function App() {
  const [envError, setEnvError] = useState<string | null>(null);
  
  // Validate environment variables when the app loads
  useEffect(() => {
    const { isValid, missingVars } = validateEnv();
    
    if (!isValid) {
      const errorMessage = `Missing environment variables: ${missingVars.join(', ')}`;
      setEnvError(errorMessage);
      toast.error(errorMessage);
      console.error(errorMessage);
    } else {
      toast.success("Environment variables loaded successfully!");
    }
  }, []);
  
  // If there's an environment error, show a message but still render the app
  const showEnvWarning = envError !== null;

  return (
    <EmergencyProvider>
      <Router>
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
          <Sidebar />
          
          <main className="flex-1 overflow-auto">
            {showEnvWarning && (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                      {envError}. Using mock data.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
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
