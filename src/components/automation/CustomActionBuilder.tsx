import { useState } from 'react';
import { X, Plus, Trash2, Send, Mail, Database, Globe, FileText, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { VariablePicker } from './VariablePicker';

interface FieldMapping {
  id: string;
  name: string;
  value: string;
  type: string;
  required: boolean;
}

interface CustomActionBuilderProps {
  onSave: (action: any) => void;
  onCancel: () => void;
  availableVariables: Array<{ name: string; type: string; source: string; description?: string }>;
}

const actionTypes = [
  { id: 'webhook', name: 'HTTP Request', icon: Webhook, description: 'Send data to any API endpoint' },
  { id: 'email', name: 'Send Email', icon: Mail, description: 'Send personalized emails' },
  { id: 'database', name: 'Database Operation', icon: Database, description: 'Create, update, or delete records' },
  { id: 'api_call', name: 'API Call', icon: Globe, description: 'Call external service APIs' },
  { id: 'file_operation', name: 'File Operation', icon: FileText, description: 'Create, read, or modify files' }
];

export const CustomActionBuilder = ({ onSave, onCancel, availableVariables }: CustomActionBuilderProps) => {
  const [actionName, setActionName] = useState('');
  const [actionDescription, setActionDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [config, setConfig] = useState<any>({});
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [showVariablePicker, setShowVariablePicker] = useState<string | null>(null);

  const getDefaultFields = (type: string): FieldMapping[] => {
    switch (type) {
      case 'webhook':
        return [
          { id: '1', name: 'url', value: '', type: 'string', required: true },
          { id: '2', name: 'method', value: 'POST', type: 'string', required: true },
          { id: '3', name: 'headers', value: '{"Content-Type": "application/json"}', type: 'object', required: false },
          { id: '4', name: 'body', value: '', type: 'object', required: false }
        ];
      case 'email':
        return [
          { id: '1', name: 'to', value: '', type: 'string', required: true },
          { id: '2', name: 'subject', value: '', type: 'string', required: true },
          { id: '3', name: 'body', value: '', type: 'string', required: true },
          { id: '4', name: 'from', value: '', type: 'string', required: false }
        ];
      case 'database':
        return [
          { id: '1', name: 'table', value: '', type: 'string', required: true },
          { id: '2', name: 'operation', value: 'insert', type: 'string', required: true },
          { id: '3', name: 'data', value: '', type: 'object', required: true },
          { id: '4', name: 'condition', value: '', type: 'string', required: false }
        ];
      case 'api_call':
        return [
          { id: '1', name: 'endpoint', value: '', type: 'string', required: true },
          { id: '2', name: 'method', value: 'GET', type: 'string', required: true },
          { id: '3', name: 'params', value: '', type: 'object', required: false },
          { id: '4', name: 'auth', value: '', type: 'object', required: false }
        ];
      default:
        return [];
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setFieldMappings(getDefaultFields(type));
  };

  const addCustomField = () => {
    const newField: FieldMapping = {
      id: Date.now().toString(),
      name: '',
      value: '',
      type: 'string',
      required: false
    };
    setFieldMappings([...fieldMappings, newField]);
  };

  const removeField = (fieldId: string) => {
    setFieldMappings(fieldMappings.filter(field => field.id !== fieldId));
  };

  const updateField = (fieldId: string, property: keyof FieldMapping, value: any) => {
    setFieldMappings(fieldMappings.map(field => 
      field.id === fieldId ? { ...field, [property]: value } : field
    ));
  };

  const handleVariableSelect = (fieldId: string, variable: string) => {
    updateField(fieldId, 'value', `{{${variable}}}`);
    setShowVariablePicker(null);
  };

  const renderFieldInput = (field: FieldMapping) => {
    if (field.name === 'method' && (selectedType === 'webhook' || selectedType === 'api_call')) {
      return (
        <Select value={field.value} onValueChange={(value) => updateField(field.id, 'value', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    if (field.name === 'operation' && selectedType === 'database') {
      return (
        <Select value={field.value} onValueChange={(value) => updateField(field.id, 'value', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="insert">Insert</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="select">Select</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    if (field.type === 'object' || field.name === 'body' || field.name === 'data' || field.name === 'headers') {
      return (
        <Textarea 
          placeholder={field.name === 'body' ? '{"message": "{{trigger.message}}"}' : '{}'}
          value={field.value}
          onChange={(e) => updateField(field.id, 'value', e.target.value)}
          rows={3}
        />
      );
    }

    return (
      <Input 
        placeholder={`Enter ${field.name}`}
        value={field.value}
        onChange={(e) => updateField(field.id, 'value', e.target.value)}
      />
    );
  };

  const handleSave = () => {
    const action = {
      name: actionName,
      description: actionDescription,
      type: selectedType,
      config,
      fieldMapping: fieldMappings.reduce((mapping, field) => {
        if (field.name && field.value) {
          mapping[field.name] = field.value;
        }
        return mapping;
      }, {} as any),
      isCustom: true
    };
    onSave(action);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Custom Action</h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label>Action Name</Label>
              <Input 
                placeholder="Send Welcome Email"
                value={actionName}
                onChange={(e) => setActionName(e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Sends a personalized welcome email to new customers"
                value={actionDescription}
                onChange={(e) => setActionDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Action Type */}
          <div>
            <Label className="text-base font-medium">Action Type</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {actionTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeChange(type.id)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedType === type.id 
                        ? 'border-automation-primary bg-automation-primary-light' 
                        : 'border-automation-border hover:bg-automation-block-hover'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className="w-5 h-5 mt-1 text-automation-primary" />
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-sm text-automation-text-secondary">{type.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field Configuration */}
          {selectedType && fieldMappings.length > 0 && (
            <div>
              <Label className="text-base font-medium">Field Configuration</Label>
              <p className="text-sm text-automation-text-secondary mb-4">
                Map data from previous steps to this action's parameters
              </p>
              
              <div className="space-y-4">
                {fieldMappings.map((field) => (
                  <div key={field.id} className="border border-automation-border rounded-lg p-4">
                    <div className="grid grid-cols-12 gap-3 items-end">
                      {/* Field Name */}
                      <div className="col-span-3">
                        <Label className="text-sm">Field Name</Label>
                        <Input 
                          placeholder="field_name"
                          value={field.name}
                          onChange={(e) => updateField(field.id, 'name', e.target.value)}
                          disabled={getDefaultFields(selectedType).some(df => df.id === field.id)}
                        />
                      </div>

                      {/* Field Type */}
                      <div className="col-span-2">
                        <Label className="text-sm">Type</Label>
                        <Select value={field.type} onValueChange={(value) => updateField(field.id, 'type', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="object">Object</SelectItem>
                            <SelectItem value="array">Array</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Required */}
                      <div className="col-span-2">
                        <Label className="text-sm">Required</Label>
                        <Select 
                          value={field.required ? 'true' : 'false'} 
                          onValueChange={(value) => updateField(field.id, 'required', value === 'true')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Value */}
                      <div className="col-span-4">
                        <Label className="text-sm">Value</Label>
                        <div className="flex gap-1">
                          {renderFieldInput(field)}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowVariablePicker(field.id)}
                            className="px-2 shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Delete */}
                      <div className="col-span-1">
                        {!getDefaultFields(selectedType).some(df => df.id === field.id) && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeField(field.id)}
                            className="text-automation-error hover:text-automation-error p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addCustomField} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Field
                </Button>
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
              disabled={!actionName || !selectedType || !fieldMappings.some(f => f.required && !f.value)}
            >
              Create Action
            </Button>
          </div>
        </div>

        {/* Variable Picker Modal */}
        {showVariablePicker && (
          <VariablePicker
            variables={availableVariables}
            onSelect={(variable) => handleVariableSelect(showVariablePicker, variable)}
            onClose={() => setShowVariablePicker(null)}
          />
        )}
      </div>
    </div>
  );
};