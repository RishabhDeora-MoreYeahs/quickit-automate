import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VariablePicker } from './VariablePicker';

interface ConditionRule {
  id: string;
  field: string;
  operator: string;
  value: string;
  logic: 'AND' | 'OR';
}

interface CustomConditionBuilderProps {
  onSave: (condition: any) => void;
  onCancel: () => void;
  availableVariables: Array<{ name: string; type: string; source: string; description?: string }>;
}

const operators = [
  { value: 'equals', label: 'Equals', types: ['string', 'number', 'boolean'] },
  { value: 'not_equals', label: 'Not Equals', types: ['string', 'number', 'boolean'] },
  { value: 'contains', label: 'Contains', types: ['string'] },
  { value: 'not_contains', label: 'Does Not Contain', types: ['string'] },
  { value: 'starts_with', label: 'Starts With', types: ['string'] },
  { value: 'ends_with', label: 'Ends With', types: ['string'] },
  { value: 'greater_than', label: 'Greater Than', types: ['number'] },
  { value: 'less_than', label: 'Less Than', types: ['number'] },
  { value: 'greater_equal', label: 'Greater Than or Equal', types: ['number'] },
  { value: 'less_equal', label: 'Less Than or Equal', types: ['number'] },
  { value: 'exists', label: 'Exists (Not Empty)', types: ['string', 'object', 'array'] },
  { value: 'not_exists', label: 'Does Not Exist (Empty)', types: ['string', 'object', 'array'] },
  { value: 'is_true', label: 'Is True', types: ['boolean'] },
  { value: 'is_false', label: 'Is False', types: ['boolean'] }
];

export const CustomConditionBuilder = ({ onSave, onCancel, availableVariables }: CustomConditionBuilderProps) => {
  const [conditionName, setConditionName] = useState('');
  const [rules, setRules] = useState<ConditionRule[]>([
    { id: '1', field: '', operator: 'equals', value: '', logic: 'AND' }
  ]);
  const [showVariablePicker, setShowVariablePicker] = useState<string | null>(null);

  const addRule = () => {
    const newRule: ConditionRule = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: '',
      logic: 'AND'
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  const updateRule = (ruleId: string, field: keyof ConditionRule, value: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    ));
  };

  const getFieldType = (fieldName: string) => {
    const variable = availableVariables.find(v => v.name === fieldName);
    return variable?.type || 'string';
  };

  const getAvailableOperators = (fieldType: string) => {
    return operators.filter(op => op.types.includes(fieldType));
  };

  const handleVariableSelect = (ruleId: string, field: 'field' | 'value', variable: string) => {
    updateRule(ruleId, field, `{{${variable}}}`);
    setShowVariablePicker(null);
  };

  const handleSave = () => {
    const condition = {
      name: conditionName,
      rules: rules.filter(rule => rule.field && rule.operator),
      isCustom: true
    };
    onSave(condition);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Custom Condition</h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <Label>Condition Name</Label>
            <Input 
              placeholder="Email Domain Check"
              value={conditionName}
              onChange={(e) => setConditionName(e.target.value)}
            />
          </div>

          {/* Rules */}
          <div>
            <Label className="text-base font-medium">Condition Rules</Label>
            <p className="text-sm text-automation-text-secondary mb-4">
              Define the logic that determines when this condition is true
            </p>
            
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div key={rule.id} className="border border-automation-border rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    {/* Logic Operator (for rules after the first) */}
                    {index > 0 && (
                      <div className="col-span-2">
                        <Label className="text-sm">Logic</Label>
                        <Select value={rule.logic} onValueChange={(value: 'AND' | 'OR') => updateRule(rule.id, 'logic', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Field */}
                    <div className={index > 0 ? "col-span-4" : "col-span-5"}>
                      <Label className="text-sm">Field</Label>
                      <div className="flex gap-1">
                        <Input 
                          placeholder="{{trigger.email}}"
                          value={rule.field}
                          onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowVariablePicker(`field-${rule.id}`)}
                          className="px-2"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Operator */}
                    <div className="col-span-3">
                      <Label className="text-sm">Operator</Label>
                      <Select value={rule.operator} onValueChange={(value) => updateRule(rule.id, 'operator', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableOperators(getFieldType(rule.field.replace(/[{}]/g, ''))).map(op => (
                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Value */}
                    <div className="col-span-2">
                      <Label className="text-sm">Value</Label>
                      <div className="flex gap-1">
                        <Input 
                          placeholder="@gmail.com"
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                          disabled={['exists', 'not_exists', 'is_true', 'is_false'].includes(rule.operator)}
                        />
                        {!['exists', 'not_exists', 'is_true', 'is_false'].includes(rule.operator) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowVariablePicker(`value-${rule.id}`)}
                            className="px-2"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Delete */}
                    <div className="col-span-1">
                      {rules.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeRule(rule.id)}
                          className="text-automation-error hover:text-automation-error p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Rule Preview */}
                  {rule.field && rule.operator && (
                    <div className="mt-3 p-2 bg-automation-block-hover rounded text-sm font-mono">
                      {index > 0 && <span className="text-automation-primary">{rule.logic} </span>}
                      <span className="text-automation-text-primary">{rule.field}</span>
                      <span className="text-automation-text-secondary"> {operators.find(op => op.value === rule.operator)?.label} </span>
                      {!['exists', 'not_exists', 'is_true', 'is_false'].includes(rule.operator) && (
                        <span className="text-automation-text-primary">{rule.value || '""'}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <Button variant="outline" onClick={addRule} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Rule
              </Button>
            </div>
          </div>

          {/* Preview */}
          {rules.length > 0 && rules[0].field && (
            <div>
              <Label className="text-base font-medium">Condition Preview</Label>
              <div className="mt-2 p-4 bg-automation-canvas rounded-lg border">
                <div className="font-mono text-sm">
                  {rules.map((rule, index) => (
                    <div key={rule.id}>
                      {index > 0 && <span className="text-automation-primary">{rule.logic} </span>}
                      <span>({rule.field} {operators.find(op => op.value === rule.operator)?.label} {!['exists', 'not_exists', 'is_true', 'is_false'].includes(rule.operator) ? rule.value || '""' : ''})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1"
              disabled={!conditionName || !rules.some(rule => rule.field && rule.operator)}
            >
              Create Condition
            </Button>
          </div>
        </div>

        {/* Variable Picker Modal */}
        {showVariablePicker && (
          <VariablePicker
            variables={availableVariables}
            onSelect={(variable) => {
              const [field, ruleId] = showVariablePicker.split('-');
              handleVariableSelect(ruleId, field as 'field' | 'value', variable);
            }}
            onClose={() => setShowVariablePicker(null)}
          />
        )}
      </div>
    </div>
  );
};