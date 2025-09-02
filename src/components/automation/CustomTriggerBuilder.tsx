import { useState } from 'react';
import { X, Plus, Trash2, Code, Clock, Database, Globe, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface CustomTriggerBuilderProps {
  onSave: (trigger: any) => void;
  onCancel: () => void;
}

const triggerTypes = [
  { id: 'webhook', name: 'Webhook', icon: Code, description: 'Receive HTTP requests from external services' },
  { id: 'schedule', name: 'Schedule', icon: Clock, description: 'Run on a specific time or interval' },
  { id: 'database', name: 'Database Change', icon: Database, description: 'Trigger when data changes' },
  { id: 'api_poll', name: 'API Polling', icon: Globe, description: 'Check an API endpoint regularly' },
  { id: 'file_watch', name: 'File Changes', icon: FileText, description: 'Monitor file system changes' }
];

export const CustomTriggerBuilder = ({ onSave, onCancel }: CustomTriggerBuilderProps) => {
  const [triggerName, setTriggerName] = useState('');
  const [triggerDescription, setTriggerDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [config, setConfig] = useState<any>({});
  const [outputFields, setOutputFields] = useState([{ name: '', type: 'string', description: '' }]);

  const renderTypeConfig = () => {
    switch (selectedType) {
      case 'webhook':
        return (
          <div className="space-y-4">
            <div>
              <Label>HTTP Method</Label>
              <Select value={config.method || 'POST'} onValueChange={(value) => setConfig({...config, method: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expected Headers (JSON)</Label>
              <Textarea 
                placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
                value={config.headers || ''}
                onChange={(e) => setConfig({...config, headers: e.target.value})}
              />
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="space-y-4">
            <div>
              <Label>Cron Expression</Label>
              <Input 
                placeholder="0 9 * * 1-5 (Every weekday at 9 AM)"
                value={config.cron || ''}
                onChange={(e) => setConfig({...config, cron: e.target.value})}
              />
            </div>
            <div>
              <Label>Timezone</Label>
              <Input 
                placeholder="America/New_York"
                value={config.timezone || ''}
                onChange={(e) => setConfig({...config, timezone: e.target.value})}
              />
            </div>
          </div>
        );
      case 'database':
        return (
          <div className="space-y-4">
            <div>
              <Label>Table Name</Label>
              <Input 
                placeholder="users"
                value={config.table || ''}
                onChange={(e) => setConfig({...config, table: e.target.value})}
              />
            </div>
            <div>
              <Label>Trigger On</Label>
              <Select value={config.operation || 'insert'} onValueChange={(value) => setConfig({...config, operation: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insert">New Record</SelectItem>
                  <SelectItem value="update">Updated Record</SelectItem>
                  <SelectItem value="delete">Deleted Record</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition (SQL WHERE clause)</Label>
              <Input 
                placeholder="status = 'active' AND created_at > NOW() - INTERVAL 1 HOUR"
                value={config.condition || ''}
                onChange={(e) => setConfig({...config, condition: e.target.value})}
              />
            </div>
          </div>
        );
      case 'api_poll':
        return (
          <div className="space-y-4">
            <div>
              <Label>API Endpoint URL</Label>
              <Input 
                placeholder="https://api.example.com/status"
                value={config.endpoint || ''}
                onChange={(e) => setConfig({...config, endpoint: e.target.value})}
              />
            </div>
            <div>
              <Label>Poll Interval (minutes)</Label>
              <Input 
                type="number"
                placeholder="5"
                value={config.interval || ''}
                onChange={(e) => setConfig({...config, interval: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label>Authentication (JSON)</Label>
              <Textarea 
                placeholder='{"type": "bearer", "token": "your-token"}'
                value={config.auth || ''}
                onChange={(e) => setConfig({...config, auth: e.target.value})}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const addOutputField = () => {
    setOutputFields([...outputFields, { name: '', type: 'string', description: '' }]);
  };

  const removeOutputField = (index: number) => {
    setOutputFields(outputFields.filter((_, i) => i !== index));
  };

  const updateOutputField = (index: number, field: string, value: string) => {
    const updated = [...outputFields];
    updated[index] = { ...updated[index], [field]: value };
    setOutputFields(updated);
  };

  const handleSave = () => {
    const trigger = {
      name: triggerName,
      description: triggerDescription,
      type: selectedType,
      config,
      outputSchema: outputFields.reduce((schema, field) => {
        if (field.name) {
          schema[field.name] = field.type;
        }
        return schema;
      }, {} as any),
      isCustom: true
    };
    onSave(trigger);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Custom Trigger</h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label>Trigger Name</Label>
              <Input 
                placeholder="New Customer Registration"
                value={triggerName}
                onChange={(e) => setTriggerName(e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Triggers when a new customer signs up for an account"
                value={triggerDescription}
                onChange={(e) => setTriggerDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Trigger Type */}
          <div>
            <Label className="text-base font-medium">Trigger Type</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {triggerTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
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

          {/* Type-specific Configuration */}
          {selectedType && (
            <div>
              <Label className="text-base font-medium">Configuration</Label>
              <div className="mt-2">
                {renderTypeConfig()}
              </div>
            </div>
          )}

          {/* Output Schema */}
          <div>
            <Label className="text-base font-medium">Output Data Fields</Label>
            <p className="text-sm text-automation-text-secondary mb-3">
              Define what data this trigger will provide to the next steps
            </p>
            <div className="space-y-3">
              {outputFields.map((field, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label className="text-sm">Field Name</Label>
                    <Input 
                      placeholder="email"
                      value={field.name}
                      onChange={(e) => updateOutputField(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <Label className="text-sm">Type</Label>
                    <Select value={field.type} onValueChange={(value) => updateOutputField(index, 'type', value)}>
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
                  <div className="flex-1">
                    <Label className="text-sm">Description</Label>
                    <Input 
                      placeholder="User's email address"
                      value={field.description}
                      onChange={(e) => updateOutputField(index, 'description', e.target.value)}
                    />
                  </div>
                  {outputFields.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeOutputField(index)}
                      className="text-automation-error hover:text-automation-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOutputField} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Output Field
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1"
              disabled={!triggerName || !selectedType}
            >
              Create Trigger
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};