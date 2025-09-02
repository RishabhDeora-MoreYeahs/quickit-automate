import { useState } from 'react';
import { Diamond, Edit2, Trash2, Plus } from 'lucide-react';
import { CustomConditionBuilder } from './CustomConditionBuilder';

interface ConditionBlockProps {
  configured: boolean;
  data?: {
    conditionName: string;
    description: string;
    rules?: any[];
  };
  onConfigure: (data: any) => void;
  onDelete: () => void;
  availableVariables?: Array<{ name: string; type: string; source: string; description?: string }>;
}

const mockConditions = [
  { 
    id: 'email-contains', 
    field: 'Email Subject',
    operator: 'contains',
    description: 'Check if email subject contains specific text'
  },
  { 
    id: 'sender-equals', 
    field: 'Sender Email',
    operator: 'equals',
    description: 'Check if sender matches specific email'
  },
  { 
    id: 'time-between', 
    field: 'Current Time',
    operator: 'between',
    description: 'Check if current time is within range'
  },
  { 
    id: 'field-not-empty', 
    field: 'Form Field',
    operator: 'is not empty',
    description: 'Check if a field has a value'
  }
];

export const ConditionBlock = ({ configured, data, onConfigure, onDelete, availableVariables = [] }: ConditionBlockProps) => {
  const [showConditionSelector, setShowConditionSelector] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<typeof mockConditions[0] | null>(null);
  const [conditionValue, setConditionValue] = useState('');

  const handleConditionSelect = (condition: typeof mockConditions[0]) => {
    setSelectedCondition(condition);
  };

  const handleConditionSave = () => {
    if (selectedCondition && conditionValue) {
      onConfigure({
        field: selectedCondition.field,
        operator: selectedCondition.operator,
        value: conditionValue,
        description: `${selectedCondition.field} ${selectedCondition.operator} "${conditionValue}"`
      });
      setShowConditionSelector(false);
      setSelectedCondition(null);
      setConditionValue('');
    }
  };

  if (!configured) {
    return (
      <div className="workflow-block workflow-block--dashed relative group">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-automation-warning text-white">
            <Diamond className="w-8 h-8" />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-automation-text-primary mb-2">
              Only if this condition is met...
            </h3>
            <p className="text-automation-text-secondary text-sm">
              Add logic to control when your automation runs
            </p>
          </div>

          <button
            onClick={() => setShowConditionSelector(true)}
            className="automation-btn-primary"
          >
            Add a Condition
          </button>
        </div>

        {/* Condition Selector Modal */}
        {showConditionSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Add Condition</h3>
              
              {!selectedCondition ? (
                <div className="space-y-3">
                  {mockConditions.map((condition) => (
                    <button
                      key={condition.id}
                      onClick={() => handleConditionSelect(condition)}
                      className="w-full text-left p-3 border border-automation-border rounded-lg hover:bg-automation-block-hover transition-colors"
                    >
                      <div className="font-medium">{condition.field} {condition.operator}</div>
                      <div className="text-xs text-automation-text-secondary mt-1">
                        {condition.description}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-automation-canvas rounded-lg">
                    <div className="font-medium">{selectedCondition.field}</div>
                    <div className="text-sm text-automation-text-muted">{selectedCondition.operator}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Value:</label>
                    <input
                      type="text"
                      value={conditionValue}
                      onChange={(e) => setConditionValue(e.target.value)}
                      placeholder="Enter value to compare..."
                      className="w-full p-3 border border-automation-border rounded-lg focus:outline-none focus:border-automation-primary"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleConditionSave}
                      disabled={!conditionValue.trim()}
                      className="flex-1 automation-btn-primary"
                    >
                      Save Condition
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCondition(null);
                        setConditionValue('');
                      }}
                      className="px-4 py-2 text-automation-text-muted hover:text-automation-text-primary"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
              
              {!selectedCondition && (
                <div className="border-t mt-4 pt-4">
                  <button
                    onClick={() => {
                      setShowConditionSelector(false);
                      setShowCustomBuilder(true);
                    }}
                    className="w-full p-3 border-2 border-dashed border-automation-primary text-automation-primary rounded-lg hover:bg-automation-primary-light transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Create Custom Condition</span>
                    </div>
                  </button>
                </div>
              )}
              
              <button
                onClick={() => setShowConditionSelector(false)}
                className="mt-4 w-full automation-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Custom Condition Builder */}
        {showCustomBuilder && (
          <CustomConditionBuilder
            availableVariables={availableVariables}
            onSave={(condition) => {
              onConfigure({
                conditionName: condition.name,
                description: `Custom condition with ${condition.rules?.length || 0} rules`,
                rules: condition.rules,
                customConfig: condition
              });
              setShowCustomBuilder(false);
            }}
            onCancel={() => setShowCustomBuilder(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="workflow-block workflow-block--configured relative">
      {/* Main condition block */}
      <div className="mb-4">
        <div className="flex items-start gap-4 group">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-automation-warning text-white flex items-center justify-center">
              <Diamond className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-automation-text-primary">IF</h3>
              <span className="text-xs bg-automation-warning text-white px-2 py-1 rounded-full">
                CONDITION
              </span>
            </div>
            
            <p className="text-sm text-automation-text-muted">
              {data?.description || 'Condition configured'}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowConditionSelector(true)}
              className="p-2 text-automation-text-muted hover:text-automation-primary transition-colors"
              aria-label="Edit condition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-automation-text-muted hover:text-automation-error transition-colors"
              aria-label="Delete condition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Branch visualization */}
      <div className="workflow-branch">
        <div className="flex-1 p-4 bg-automation-success-light border-2 border-automation-success rounded-lg text-center">
          <div className="text-sm font-medium text-automation-success">YES</div>
          <div className="text-xs text-automation-text-muted mt-1">Continue workflow</div>
        </div>
        
        <div className="flex-1 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg text-center">
          <div className="text-sm font-medium text-gray-600">NO</div>
          <div className="text-xs text-gray-500 mt-1">Stop workflow</div>
        </div>
      </div>
    </div>
  );
};