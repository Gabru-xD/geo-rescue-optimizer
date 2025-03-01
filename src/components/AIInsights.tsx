
import React from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { analyzeIncident, generateIncidentSummary } from '../utils/aiService';
import { Lightbulb, AlertTriangle, Clock, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AIInsights = () => {
  const { activeIncident } = useEmergency();
  
  if (!activeIncident) {
    return (
      <div className="border rounded-lg p-5 bg-card h-full flex flex-col items-center justify-center text-center animate-fade-in">
        <Bot className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">AI Insights</h3>
        <p className="text-muted-foreground max-w-md">
          Select an incident to view AI-powered analysis and recommendations.
        </p>
      </div>
    );
  }
  
  const analysis = analyzeIncident(activeIncident);
  const summary = generateIncidentSummary(activeIncident);
  
  // Determine risk color based on score
  const getRiskColor = (score: number) => {
    if (score < 25) return 'bg-green-500';
    if (score < 50) return 'bg-yellow-500';
    if (score < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-4 animate-scale-in">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Insights
            </CardTitle>
            <Badge variant="outline" className="px-2 py-0 h-6">Powered by AI</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{summary}</p>
          
          <div className="space-y-4">
            {/* Risk Assessment */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Risk Assessment</span>
                <span className="text-sm">{analysis.riskLevel}/100</span>
              </div>
              <Progress 
                value={analysis.riskLevel} 
                max={100}
                className="h-2 bg-muted"
              >
                <div 
                  className={`h-full ${getRiskColor(analysis.riskLevel)}`} 
                  style={{ width: `${analysis.riskLevel}%` }}
                />
              </Progress>
            </div>
            
            {/* Expected Duration */}
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Expected Duration</p>
                <p className="text-sm text-muted-foreground">
                  Approximately {analysis.expectedDuration} hours until resolution
                </p>
              </div>
            </div>
            
            {/* Recommended Resources */}
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Recommended Resources</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.recommendedResources.map((resource, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action Items */}
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Recommended Actions</p>
                <ul className="mt-1 text-sm text-muted-foreground space-y-1">
                  {analysis.actionItems.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
