
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
    }
  }, []);
  
  // If there's an environment error, show a message
  if (envError) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-50 dark:bg-zinc-900 text-center p-4">
        <div className="glass-effect rounded-lg p-6 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="mb-4">{envError}</p>
          <p className="text-sm">
            Please create a <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
            .env</code> file with the required variables.
          </p>
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-left overflow-auto">
            <pre className="text-xs">
              VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
            </pre>
          </div>
        </div>
      </div>
    );
  }

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
