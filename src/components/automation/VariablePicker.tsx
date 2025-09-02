import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Variable {
  name: string;
  type: string;
  source: string;
  description?: string;
}

interface VariablePickerProps {
  variables: Variable[];
  onSelect: (variableName: string) => void;
  onClose: () => void;
}

export const VariablePicker = ({ variables, onSelect, onClose }: VariablePickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVariables = variables.filter(variable =>
    variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variable.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variable.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedVariables = filteredVariables.reduce((groups, variable) => {
    const source = variable.source;
    if (!groups[source]) {
      groups[source] = [];
    }
    groups[source].push(variable);
    return groups;
  }, {} as Record<string, Variable[]>);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'number': return 'bg-green-100 text-green-800 border-green-200';
      case 'boolean': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'object': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'array': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select Variable</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-automation-text-muted w-4 h-4" />
          <Input
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Variables List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {Object.entries(groupedVariables).map(([source, vars]) => (
            <div key={source}>
              <h4 className="font-medium text-automation-text-primary mb-2 sticky top-0 bg-background py-1">
                {source}
              </h4>
              <div className="space-y-2">
                {vars.map((variable) => (
                  <button
                    key={`${source}-${variable.name}`}
                    onClick={() => onSelect(variable.name)}
                    className="w-full text-left p-3 border border-automation-border rounded-lg hover:bg-automation-block-hover transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-automation-text-primary">
                            {variable.name}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded border ${getTypeColor(variable.type)}`}>
                            {variable.type}
                          </span>
                        </div>
                        {variable.description && (
                          <p className="text-sm text-automation-text-secondary">
                            {variable.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredVariables.length === 0 && (
            <div className="text-center py-8 text-automation-text-muted">
              {searchTerm ? 'No variables found matching your search.' : 'No variables available.'}
            </div>
          )}
        </div>

        {/* Usage Hint */}
        <div className="mt-4 p-3 bg-automation-canvas rounded-lg border">
          <p className="text-sm text-automation-text-secondary">
            <strong>Tip:</strong> Variables will be inserted as <code className="px-1 py-0.5 bg-automation-block-hover rounded">{'{{variable.name}}'}</code> format
          </p>
        </div>
      </div>
    </div>
  );
};