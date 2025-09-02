import React, { useState } from 'react';
import { Play, X, CheckCircle, AlertCircle, Zap, Diamond, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  configured: boolean;
  data?: any;
}

interface AutomationPreviewProps {
  workflowSteps: WorkflowStep[];
  onClose: () => void;
  onTest: () => void;
}

export const AutomationPreview = ({ workflowSteps, onClose, onTest }: AutomationPreviewProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'pending'>>({});

  const handleTestRun = async () => {
    setIsRunning(true);
    setTestResults({});

    // Simulate test execution
    for (const step of workflowSteps) {
      if (!step.configured) continue;
      
      setTestResults(prev => ({ ...prev, [step.id]: 'pending' }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Random success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      setTestResults(prev => ({ 
        ...prev, 
        [step.id]: success ? 'success' : 'error' 
      }));
      
      // If step fails, stop execution
      if (!success) break;
    }
    
    setIsRunning(false);
    onTest();
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger': return Zap;
      case 'condition': return Diamond;
      case 'action': return Rocket;
      default: return Zap;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'text-automation-primary';
      case 'condition': return 'text-automation-warning';
      case 'action': return 'text-automation-secondary';
      default: return 'text-automation-primary';
    }
  };

  const getResultIcon = (stepId: string) => {
    const result = testResults[stepId];
    switch (result) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending': return <div className="w-5 h-5 border-2 border-automation-primary border-t-transparent rounded-full animate-spin" />;
      default: return null;
    }
  };

  const configuredSteps = workflowSteps.filter(step => step.configured);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Automation Preview & Test</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Workflow Summary */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Workflow Summary</h3>
            <div className="bg-automation-canvas rounded-lg p-4">
              <div className="space-y-3">
                {configuredSteps.map((step, index) => {
                  const IconComponent = getStepIcon(step.type);
                  return (
                    <div key={step.id} className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-automation-text-muted">
                          {index + 1}.
                        </span>
                        <IconComponent className={`w-5 h-5 ${getStepColor(step.type)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {step.type === 'trigger' && `Trigger: ${step.data?.triggerName}`}
                          {step.type === 'condition' && `Condition: ${step.data?.conditionName || 'Check condition'}`}
                          {step.type === 'action' && `Action: ${step.data?.actionName}`}
                        </div>
                        <div className="text-sm text-automation-text-secondary">
                          {step.data?.description}
                        </div>
                        {step.data?.customConfig && (
                          <div className="text-xs text-automation-primary mt-1">
                            Custom Configuration ⚙️
                          </div>
                        )}
                      </div>
                      {getResultIcon(step.id)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Data Flow Preview */}
          {configuredSteps.length > 1 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Data Flow</h3>
              <div className="bg-automation-canvas rounded-lg p-4">
                <div className="space-y-2 font-mono text-sm">
                  {configuredSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <span className="text-automation-text-muted">
                        {step.type}.{index + 1}:
                      </span>
                      <span className="text-automation-text-primary">
                        {step.type === 'trigger' && '{ email, timestamp, user_data }'}
                        {step.type === 'condition' && '{ result: boolean }'}
                        {step.type === 'action' && '{ status: "completed", response: {...} }'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test Section */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium">Test Your Automation</h3>
              <p className="text-sm text-automation-text-secondary">
                Run a test to see how your automation performs
              </p>
            </div>
            <Button 
              onClick={handleTestRun} 
              disabled={isRunning || configuredSteps.length === 0}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running Test...' : 'Run Test'}
            </Button>
          </div>

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="bg-automation-canvas rounded-lg p-4">
              <h4 className="font-medium mb-3">Test Results</h4>
              <div className="space-y-2">
                {configuredSteps.map((step) => {
                  const result = testResults[step.id];
                  if (!result) return null;
                  
                  return (
                    <div key={step.id} className="flex items-center justify-between p-2 bg-background rounded border">
                      <div className="flex items-center gap-2">
                        <div className={getStepColor(step.type)}>
                          {React.createElement(getStepIcon(step.type), { className: 'w-4 h-4' })}
                        </div>
                        <span className="text-sm">
                          {step.data?.triggerName || step.data?.conditionName || step.data?.actionName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getResultIcon(step.id)}
                        <span className={`text-sm ${
                          result === 'success' ? 'text-green-600' : 
                          result === 'error' ? 'text-red-600' : 
                          'text-automation-text-muted'
                        }`}>
                          {result === 'success' ? 'Success' : 
                           result === 'error' ? 'Failed' : 
                           'Running...'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t mt-6">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close Preview
          </Button>
          <Button 
            onClick={onClose} 
            className="flex-1"
            disabled={configuredSteps.length === 0}
          >
            Save Automation
          </Button>
        </div>
      </div>
    </div>
  );
};