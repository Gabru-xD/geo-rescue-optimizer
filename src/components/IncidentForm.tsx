
import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from "sonner";

const IncidentForm = () => {
  const { addIncident } = useEmergency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    priority: '',
    address: '',
    affectedPeople: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.type || !formData.priority || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new incident
      const newIncident = {
        id: `incident-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        priority: formData.priority as any,
        status: 'pending' as const,
        location: {
          address: formData.address,
          // In a real app, we'd geocode the address to get coordinates
          coordinates: {
            latitude: 37.7749 + (Math.random() * 0.05 - 0.025),
            longitude: -122.4194 + (Math.random() * 0.05 - 0.025),
          },
        },
        reportedTime: new Date().toISOString(),
        estimatedResponseTime: Math.floor(Math.random() * 15) + 1,
        assignedResources: [],
        affectedPeople: formData.affectedPeople ? parseInt(formData.affectedPeople) : undefined,
        updates: [
          {
            timestamp: new Date().toISOString(),
            message: `New ${formData.type.toLowerCase()} incident reported.`,
            author: 'System',
          },
        ],
      };
      
      await addIncident(newIncident);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: '',
        priority: '',
        address: '',
        affectedPeople: '',
      });
    } catch (error) {
      console.error('Error submitting incident:', error);
      toast.error('Failed to report incident. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Incident title"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Incident Type
          </label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
              <SelectItem value="Traffic Accident">Traffic Accident</SelectItem>
              <SelectItem value="Fire">Fire</SelectItem>
              <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
              <SelectItem value="Hazardous Material">Hazardous Material</SelectItem>
              <SelectItem value="Public Disturbance">Public Disturbance</SelectItem>
              <SelectItem value="Structure Collapse">Structure Collapse</SelectItem>
              <SelectItem value="Missing Person">Missing Person</SelectItem>
              <SelectItem value="Power Outage">Power Outage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority
          </label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleSelectChange('priority', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Location
        </label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the incident"
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label htmlFor="affectedPeople" className="block text-sm font-medium mb-1">
          Affected People (optional)
        </label>
        <Input
          id="affectedPeople"
          name="affectedPeople"
          type="number"
          value={formData.affectedPeople}
          onChange={handleChange}
          placeholder="Number of affected people"
          disabled={isSubmitting}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Report Incident'}
      </Button>
    </form>
  );
};

export default IncidentForm;
