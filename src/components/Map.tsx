
import React, { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEmergency } from '../context/EmergencyContext';
import { AlertCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Incident } from '../types';

// This should be a valid Mapbox token in a real app
// Using a placeholder since this is a demo
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
mapboxgl.accessToken = MAPBOX_TOKEN;

const MapComponent = () => {
  const { incidents, setActiveIncident, activeIncident } = useEmergency();
  const [popupInfo, setPopupInfo] = useState<Incident | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  
  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-122.4194, 37.7749],
      zoom: 12,
      pitch: 0,
      bearing: 0
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
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
  
  // Create a marker element
  const createMarkerElement = (incident: Incident) => {
    const el = document.createElement('div');
    el.className = `cursor-pointer transform hover:scale-110 transition-transform duration-200 ${
      activeIncident?.id === incident.id ? 'scale-125' : ''
    }`;
    
    // Create temporary DOM to render React component to HTML
    const temp = document.createElement('div');
    const icon = getIncidentMarker(incident.priority);
    
    // Convert React element to HTML
    temp.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${icon.props.size}" height="${icon.props.size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${icon.props.className}">
        ${icon.type.name === 'AlertOctagon' ? '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' : ''}
        ${icon.type.name === 'AlertCircle' ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' : ''}
        ${icon.type.name === 'AlertTriangle' ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>' : ''}
        ${icon.type.name === 'Info' ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>' : ''}
      </svg>
    `;
    
    el.innerHTML = temp.innerHTML;
    
    // Add click event listener
    el.addEventListener('click', () => {
      setPopupInfo(incident);
    });
    
    return el;
  };
  
  // Update markers when incidents change
  useEffect(() => {
    if (!map.current) return;
    
    const activeIncidents = incidents.filter(incident => incident.status !== 'resolved');
    
    // Remove old markers
    Object.keys(markersRef.current).forEach(id => {
      if (!activeIncidents.find(incident => incident.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
    
    // Add/update markers
    activeIncidents.forEach(incident => {
      const coords = [
        incident.location.coordinates.longitude,
        incident.location.coordinates.latitude
      ];
      
      if (markersRef.current[incident.id]) {
        // Update existing marker
        markersRef.current[incident.id]
          .setLngLat(coords as [number, number])
          .getElement().innerHTML = createMarkerElement(incident).innerHTML;
      } else {
        // Create new marker
        const marker = new mapboxgl.Marker({ element: createMarkerElement(incident) })
          .setLngLat(coords as [number, number])
          .addTo(map.current!);
        
        markersRef.current[incident.id] = marker;
      }
    });
  }, [incidents, activeIncident, getIncidentMarker]);
  
  // Focus map on active incident
  useEffect(() => {
    if (!map.current || !activeIncident) return;
    
    map.current.flyTo({
      center: [
        activeIncident.location.coordinates.longitude,
        activeIncident.location.coordinates.latitude
      ],
      zoom: 14,
      essential: true
    });
  }, [activeIncident]);
  
  // Handle popup display
  useEffect(() => {
    if (!map.current) return;
    
    // Remove existing popup
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
    
    // Show new popup if info is available
    if (popupInfo) {
      const popupNode = document.createElement('div');
      popupNode.className = 'p-2 max-w-[250px]';
      
      popupNode.innerHTML = `
        <h3 class="font-medium text-sm mb-1">${popupInfo.title}</h3>
        <p class="text-xs text-gray-500 mb-2">${popupInfo.location.address}</p>
        <div class="flex gap-2 mb-2">
          <span class="status-chip priority-${popupInfo.priority}">${popupInfo.priority}</span>
          <span class="status-chip bg-gray-100 text-gray-700">${popupInfo.status.replace('_', ' ')}</span>
        </div>
      `;
      
      const buttonWrapper = document.createElement('div');
      const button = document.createElement('button');
      button.className = 'w-full text-xs py-1 h-7 bg-primary text-primary-foreground rounded-md';
      button.textContent = 'View Details';
      button.onclick = () => {
        setActiveIncident(popupInfo);
        setPopupInfo(null);
      };
      buttonWrapper.appendChild(button);
      popupNode.appendChild(buttonWrapper);
      
      popupRef.current = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat([
          popupInfo.location.coordinates.longitude,
          popupInfo.location.coordinates.latitude
        ])
        .setDOMContent(popupNode)
        .addTo(map.current);
        
      popupRef.current.on('close', () => {
        setPopupInfo(null);
      });
    }
  }, [popupInfo, setActiveIncident]);
  
  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative animate-fade-in">
      <div ref={mapContainer} className="absolute inset-0" style={{ borderRadius: '0.5rem' }}></div>
    </div>
  );
};

export default MapComponent;
