import { useState } from 'react';
import { AutomationHeader } from '@/components/automation/AutomationHeader';
import { TriggerBlock } from '@/components/automation/TriggerBlock';
import { ActionBlock } from '@/components/automation/ActionBlock';
import { ConditionBlock } from '@/components/automation/ConditionBlock';
import { WorkflowConnector } from '@/components/automation/WorkflowConnector';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  configured: boolean;
  data?: any;
}

const Automate = () => {
  const [isAutomationOn, setIsAutomationOn] = useState(false);
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
        onSave={() => console.log('Saving automation...')}
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
    </div>
  );
};

export default Automate;