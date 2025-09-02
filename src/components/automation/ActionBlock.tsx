import { useState } from 'react';
import { Rocket, Edit2, Trash2 } from 'lucide-react';

interface ActionBlockProps {
  configured: boolean;
  data?: {
    appName: string;
    actionName: string;
    description: string;
    appIcon?: string;
    mapping?: Record<string, string>;
  };
  onConfigure: (data: any) => void;
  onDelete: () => void;
}

const mockActions = [
  { 
    id: 'send-email', 
    name: 'Send Email', 
    app: 'Gmail',
    description: 'Send an email to specified recipients',
    icon: '✉️'
  },
  { 
    id: 'create-task', 
    name: 'Create Task', 
    app: 'Todoist',
    description: 'Create a new task in your project',
    icon: '✅'
  },
  { 
    id: 'send-slack', 
    name: 'Send Message', 
    app: 'Slack',
    description: 'Send a message to a channel or user',
    icon: '💬'
  },
  { 
    id: 'create-record', 
    name: 'Create Record', 
    app: 'Airtable',
    description: 'Add a new record to your database',
    icon: '📊'
  },
  { 
    id: 'http-request', 
    name: 'HTTP Request', 
    app: 'Custom',
    description: 'Make a custom HTTP request',
    icon: '🔗'
  }
];

export const ActionBlock = ({ configured, data, onConfigure, onDelete }: ActionBlockProps) => {
  const [showActionSelector, setShowActionSelector] = useState(false);

  const handleActionSelect = (action: typeof mockActions[0]) => {
    onConfigure({
      appName: action.app,
      actionName: action.name,
      description: action.description,
      appIcon: action.icon,
      mapping: { 
        // Mock field mapping
        to: '{trigger.email}',
        subject: 'New automation triggered'
      }
    });
    setShowActionSelector(false);
  };

  if (!configured) {
    return (
      <div className="workflow-block workflow-block--dashed relative group">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-automation-secondary text-white">
            <Rocket className="w-8 h-8" />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-automation-text-primary mb-2">
              Then do this...
            </h3>
            <p className="text-automation-text-secondary text-sm">
              Choose what happens when your trigger fires
            </p>
          </div>

          <button
            onClick={() => setShowActionSelector(true)}
            className="automation-btn-primary"
          >
            Choose an Action
          </button>
        </div>

        {/* Action Selector Modal */}
        {showActionSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Select an Action</h3>
              <div className="space-y-3">
                {mockActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleActionSelect(action)}
                    className="w-full text-left p-3 border border-automation-border rounded-lg hover:bg-automation-block-hover transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{action.icon}</span>
                      <div>
                        <div className="font-medium">{action.name}</div>
                        <div className="text-sm text-automation-text-muted">{action.app}</div>
                        <div className="text-xs text-automation-text-secondary mt-1">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowActionSelector(false)}
                className="mt-4 w-full automation-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="workflow-block workflow-block--configured relative group">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-automation-secondary text-white flex items-center justify-center">
            {data?.appIcon ? (
              <span className="text-xl">{data.appIcon}</span>
            ) : (
              <Rocket className="w-6 h-6" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-automation-text-primary">
              {data?.actionName || 'Configured Action'}
            </h3>
            <span className="text-xs bg-automation-secondary text-white px-2 py-1 rounded-full">
              ACTION
            </span>
          </div>
          
          <div className="text-sm text-automation-text-secondary mb-2">
            {data?.appName}
          </div>
          
          <p className="text-sm text-automation-text-muted mb-2">
            {data?.description || 'Action configured and ready'}
          </p>

          {/* Show field mapping if available */}
          {data?.mapping && (
            <div className="text-xs text-automation-text-muted bg-automation-canvas p-2 rounded">
              {Object.entries(data.mapping).map(([field, value]) => (
                <div key={field}>
                  <strong>{field}:</strong> {value}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Action buttons - shown on hover */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowActionSelector(true)}
            className="p-2 text-automation-text-muted hover:text-automation-primary transition-colors"
            aria-label="Edit action"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-automation-text-muted hover:text-automation-error transition-colors"
            aria-label="Delete action"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};