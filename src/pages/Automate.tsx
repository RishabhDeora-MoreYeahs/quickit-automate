import { useState } from 'react';
import { AutomationHeader } from '@/components/automation/AutomationHeader';
import { TriggerBlock } from '@/components/automation/TriggerBlock';
import { ActionBlock } from '@/components/automation/ActionBlock';
import { ConditionBlock } from '@/components/automation/ConditionBlock';
import { WorkflowConnector } from '@/components/automation/WorkflowConnector';
import { AutomationPreview } from '@/components/automation/AutomationPreview';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  configured: boolean;
  data?: any;
}

const Automate = () => {
  const [isAutomationOn, setIsAutomationOn] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: 'trigger-1', type: 'trigger', configured: false }
  ]);

  const hasRequiredSteps = workflowSteps.some(step => step.type === 'trigger' && step.configured) && 
                          workflowSteps.some(step => step.type === 'action' && step.configured);

  const addStep = (type: 'condition' | 'action', afterId: string) => {
    const newStep: WorkflowStep = {
      id: `${type}-${Date.now()}`,
      type,
      configured: false
    };
    
    const currentIndex = workflowSteps.findIndex(step => step.id === afterId);
    const newSteps = [...workflowSteps];
    newSteps.splice(currentIndex + 1, 0, newStep);
    setWorkflowSteps(newSteps);
  };

  const configureStep = (id: string, data: any) => {
    setWorkflowSteps(steps => 
      steps.map(step => 
        step.id === id 
          ? { ...step, configured: true, data }
          : step
      )
    );
  };

  const deleteStep = (id: string) => {
    setWorkflowSteps(steps => steps.filter(step => step.id !== id));
  };

  const renderStep = (step: WorkflowStep, index: number) => {
    // Generate available variables from previous steps
    const availableVariables = workflowSteps
      .slice(0, index) // Only steps before current one
      .filter(s => s.configured && s.data)
      .flatMap(s => {
        const variables = [];
        
        if (s.type === 'trigger') {
          // Add trigger variables
          if (s.data.customConfig?.outputSchema) {
            Object.entries(s.data.customConfig.outputSchema).forEach(([key, type]) => {
              variables.push({
                name: `trigger.${key}`,
                type: type as string,
                source: `Trigger: ${s.data.triggerName}`,
                description: `From ${s.data.triggerName} trigger`
              });
            });
          } else {
            // Default trigger variables for mock triggers
            variables.push(
              { name: 'trigger.id', type: 'string', source: `Trigger: ${s.data.triggerName}`, description: 'Unique trigger ID' },
              { name: 'trigger.timestamp', type: 'string', source: `Trigger: ${s.data.triggerName}`, description: 'When trigger occurred' },
              { name: 'trigger.data', type: 'object', source: `Trigger: ${s.data.triggerName}`, description: 'Raw trigger data' }
            );
          }
        } else if (s.type === 'condition') {
          variables.push({
            name: `condition_${index}.result`,
            type: 'boolean',
            source: `Condition: ${s.data.conditionName}`,
            description: 'Condition evaluation result'
          });
        } else if (s.type === 'action') {
          variables.push({
            name: `action_${index}.result`,
            type: 'object',
            source: `Action: ${s.data.actionName}`,
            description: 'Action execution result'
          });
        }
        
        return variables;
      });

    switch (step.type) {
      case 'trigger':
        return (
          <TriggerBlock
            key={step.id}
            configured={step.configured}
            data={step.data}
            onConfigure={(data) => configureStep(step.id, data)}
            onDelete={() => deleteStep(step.id)}
          />
        );
      case 'condition':
        return (
          <ConditionBlock
            key={step.id}
            configured={step.configured}
            data={step.data}
            onConfigure={(data) => configureStep(step.id, data)}
            onDelete={() => deleteStep(step.id)}
            availableVariables={availableVariables}
          />
        );
      case 'action':
        return (
          <ActionBlock
            key={step.id}
            configured={step.configured}
            data={step.data}
            onConfigure={(data) => configureStep(step.id, data)}
            onDelete={() => deleteStep(step.id)}
            availableVariables={availableVariables}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AutomationHeader
        isAutomationOn={isAutomationOn}
        onToggleAutomation={setIsAutomationOn}
        canSave={hasRequiredSteps}
        onSave={() => setShowPreview(true)}
      />
      
      <main className="automation-canvas px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-0">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="w-full max-w-lg">
                {renderStep(step, index)}
                
                {/* Add connector after each step except the last */}
                {index < workflowSteps.length - 1 && (
                  <WorkflowConnector />
                )}
                
                {/* Show add step connector after configured steps */}
                {step.configured && index === workflowSteps.length - 1 && (
                  <WorkflowConnector 
                    showAddButton={true}
                    onAddStep={(type) => addStep(type, step.id)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Automation Preview Modal */}
      {showPreview && (
        <AutomationPreview
          workflowSteps={workflowSteps}
          onClose={() => setShowPreview(false)}
          onTest={() => console.log('Test completed')}
        />
      )}
    </div>
  );
};

export default Automate;