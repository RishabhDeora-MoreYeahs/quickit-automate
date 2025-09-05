import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VariablePicker } from './VariablePicker';
import { Type, Hash, FileText, Calendar, ToggleLeft } from 'lucide-react';

interface ServiceConfigurationFormProps {
  service: string;
  serviceIcon: string;
  actionName: string;
  inputFields: { [key: string]: { type: string; required: boolean; description?: string } };
  availableVariables?: Array<{ name: string; type: string; source: string; description?: string }>;
  onSave: (config: any) => void;
  onCancel: () => void;
}

export const ServiceConfigurationForm = ({
  service,
  serviceIcon,
  actionName,
  inputFields,
  availableVariables = [],
  onSave,
  onCancel
}: ServiceConfigurationFormProps) => {
  const [config, setConfig] = useState<{ [key: string]: string }>({});
  const [showVariablePicker, setShowVariablePicker] = useState<string | null>(null);

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'string': return <Type className="w-4 h-4" />;
      case 'number': return <Hash className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'boolean': return <ToggleLeft className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  const handleVariableSelect = (fieldName: string, variable: any) => {
    setConfig(prev => ({
      ...prev,
      [fieldName]: `{{${variable.name}}}`
    }));
    setShowVariablePicker(null);
  };

  const handleSave = () => {
    const requiredFields = Object.entries(inputFields)
      .filter(([_, field]) => field.required)
      .map(([name, _]) => name);

    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    onSave({
      service,
      actionName,
      config,
      serviceIcon
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b">
          <div className="w-12 h-12 rounded-lg bg-automation-primary-light flex items-center justify-center text-2xl">
            {serviceIcon}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Configure {actionName}</h3>
            <p className="text-automation-text-secondary">{service}</p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(inputFields).map(([fieldName, fieldConfig]) => (
            <div key={fieldName}>
              <label className="block text-sm font-medium mb-2">
                <div className="flex items-center gap-2">
                  {getFieldIcon(fieldConfig.type)}
                  {fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {fieldConfig.required && <span className="text-red-500">*</span>}
                </div>
              </label>
              
              {fieldConfig.description && (
                <p className="text-xs text-automation-text-secondary mb-2">
                  {fieldConfig.description}
                </p>
              )}

              <div className="relative">
                {fieldConfig.type === 'text' ? (
                  <textarea
                    value={config[fieldName] || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, [fieldName]: e.target.value }))}
                    placeholder={`Enter ${fieldName.replace(/_/g, ' ')}`}
                    rows={3}
                    className="w-full px-3 py-2 border border-automation-border rounded-lg focus:outline-none focus:ring-2 focus:ring-automation-primary resize-none"
                  />
                ) : fieldConfig.type === 'boolean' ? (
                  <select
                    value={config[fieldName] || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, [fieldName]: e.target.value }))}
                    className="w-full px-3 py-2 border border-automation-border rounded-lg focus:outline-none focus:ring-2 focus:ring-automation-primary"
                  >
                    <option value="">Select...</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <input
                    type={fieldConfig.type === 'number' ? 'number' : 'text'}
                    value={config[fieldName] || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, [fieldName]: e.target.value }))}
                    placeholder={`Enter ${fieldName.replace(/_/g, ' ')}`}
                    className="w-full px-3 py-2 border border-automation-border rounded-lg focus:outline-none focus:ring-2 focus:ring-automation-primary"
                  />
                )}
                
                {availableVariables.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-2 text-xs"
                    onClick={() => setShowVariablePicker(fieldName)}
                  >
                    Use Variable
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6 mt-6 border-t">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>

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