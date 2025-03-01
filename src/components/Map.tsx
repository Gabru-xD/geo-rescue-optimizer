
import React, { useState, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEmergency } from '../context/EmergencyContext';
import { Incident } from '../types';
import { AlertCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This should be a valid Mapbox token in a real app
// Using a placeholder since this is a demo
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const MapComponent = () => {
  const { incidents, setActiveIncident, activeIncident } = useEmergency();
  const [popupInfo, setPopupInfo] = useState<Incident | null>(null);
  
  const [viewState, setViewState] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
    bearing: 0,
    pitch: 0
  });

  // Focus map on active incident
  useEffect(() => {
    if (activeIncident) {
      setViewState({
        ...viewState,
        latitude: activeIncident.location.coordinates.latitude,
        longitude: activeIncident.location.coordinates.longitude,
        zoom: 14,
      });
    }
  }, [activeIncident]);

  // Select incident marker based on priority
  const getIncidentMarker = useCallback((priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertOctagon className="text-emergency-critical" size={24} />;
      case 'high':
        return <AlertCircle className="text-emergency-high" size={22} />;
      case 'medium':
        return <AlertTriangle className="text-emergency-medium" size={20} />;
      default:
        return <Info className="text-emergency-low" size={18} />;
    }
  }, []);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative animate-fade-in">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
      >
        <NavigationControl position="top-right" />
        
        {incidents.filter(incident => incident.status !== 'resolved').map(incident => (
          <Marker
            key={incident.id}
            longitude={incident.location.coordinates.longitude}
            latitude={incident.location.coordinates.latitude}
            anchor="bottom"
            onClick={e => {
              // Prevent click from propagating to the map
              e.originalEvent.stopPropagation();
              setPopupInfo(incident);
            }}
          >
            <div 
              className={`
                cursor-pointer transform hover:scale-110 transition-transform duration-200
                ${activeIncident?.id === incident.id ? 'scale-125' : ''}
              `}
            >
              {getIncidentMarker(incident.priority)}
            </div>
          </Marker>
        ))}
        
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.location.coordinates.longitude}
            latitude={popupInfo.location.coordinates.latitude}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="z-50"
          >
            <div className="p-2 max-w-[250px]">
              <h3 className="font-medium text-sm mb-1">{popupInfo.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{popupInfo.location.address}</p>
              
              <div className="flex gap-2 mb-2">
                <span className={`status-chip priority-${popupInfo.priority}`}>
                  {popupInfo.priority}
                </span>
                <span className="status-chip bg-gray-100 text-gray-700">
                  {popupInfo.status.replace('_', ' ')}
                </span>
              </div>
              
              <Button 
                size="sm" 
                className="w-full text-xs py-1 h-7"
                onClick={() => {
                  setActiveIncident(popupInfo);
                  setPopupInfo(null);
                }}
              >
                View Details
              </Button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
