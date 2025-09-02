import { useState } from 'react';
import { Plus, Diamond, Rocket } from 'lucide-react';

interface WorkflowConnectorProps {
  showAddButton?: boolean;
  onAddStep?: (type: 'condition' | 'action') => void;
}

export const WorkflowConnector = ({ showAddButton = false, onAddStep }: WorkflowConnectorProps) => {
  const [showStepSelector, setShowStepSelector] = useState(false);

  const handleAddStep = (type: 'condition' | 'action') => {
    onAddStep?.(type);
    setShowStepSelector(false);
  };

  if (!showAddButton) {
    return <div className="workflow-connector" />;
  }

  return (
    <div className="workflow-connector">
      <button
        className="workflow-connector-add"
        onClick={() => setShowStepSelector(true)}
        aria-label="Add step"
      >
        <Plus className="w-4 h-4 text-automation-primary" />
      </button>

      {/* Step Type Selector */}
      {showStepSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Add Step</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleAddStep('condition')}
                className="w-full flex items-start gap-4 p-4 border border-automation-border rounded-lg hover:bg-automation-block-hover transition-colors text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-automation-warning text-white flex items-center justify-center">
                  <Diamond className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Add a Condition</div>
                  <div className="text-sm text-automation-text-secondary">
                    Only continue if certain criteria are met
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleAddStep('action')}
                className="w-full flex items-start gap-4 p-4 border border-automation-border rounded-lg hover:bg-automation-block-hover transition-colors text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-automation-secondary text-white flex items-center justify-center">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Add an Action</div>
                  <div className="text-sm text-automation-text-secondary">
                    Do something when the trigger fires
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowStepSelector(false)}
              className="mt-4 w-full automation-btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};