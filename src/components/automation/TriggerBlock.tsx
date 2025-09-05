import { useState } from 'react';
import { Zap, Edit2, Trash2, Settings, Plus } from 'lucide-react';
import { CustomTriggerBuilder } from './CustomTriggerBuilder';
import { ServiceTriggerSelector } from './ServiceTriggerSelector';
import { ServiceIntegrationManager } from './ServiceIntegrationManager';

interface TriggerBlockProps {
  configured: boolean;
  data?: {
    appName: string;
    triggerName: string;
    description: string;
    appIcon?: string;
  };
  onConfigure: (data: any) => void;
  onDelete: () => void;
}

const mockTriggers = [
  { 
    id: 'email-received', 
    name: 'Email Received', 
    app: 'Gmail',
    description: 'When a new email is received in your inbox',
    icon: '📧'
  },
  { 
    id: 'form-submitted', 
    name: 'Form Submitted', 
    app: 'Google Forms',
    description: 'When someone submits a form response',
    icon: '📝'
  },
  { 
    id: 'calendar-event', 
    name: 'Calendar Event', 
    app: 'Google Calendar',
    description: 'When a new event is created',
    icon: '📅'
  },
  { 
    id: 'webhook-received', 
    name: 'Webhook Received', 
    app: 'Custom',
    description: 'When your webhook URL receives data',
    icon: '🔗'
  }
];

export const TriggerBlock = ({ configured, data, onConfigure, onDelete }: TriggerBlockProps) => {
  const [showTriggerSelector, setShowTriggerSelector] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [showServiceTriggers, setShowServiceTriggers] = useState(false);
  const [showServiceManager, setShowServiceManager] = useState(false);

  const handleTriggerSelect = (trigger: typeof mockTriggers[0]) => {
    onConfigure({
      appName: trigger.app,
      triggerName: trigger.name,
      description: trigger.description,
      appIcon: trigger.icon
    });
    setShowTriggerSelector(false);
  };

  if (!configured) {
    return (
      <div className="workflow-block workflow-block--dashed relative group">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-automation-primary-light">
            <Zap className="w-8 h-8 text-automation-primary" />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-automation-text-primary mb-2">
              1. When this happens...
            </h3>
            <p className="text-automation-text-secondary text-sm">
              Choose the event that starts your automation
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowTriggerSelector(true)}
              className="automation-btn-primary"
            >
              Choose Basic Trigger
            </button>
            <button
              onClick={() => setShowServiceTriggers(true)}
              className="automation-btn-secondary"
            >
              Choose Service Trigger
            </button>
          </div>
        </div>

        {/* Trigger Selector Modal */}
        {showTriggerSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Select a Trigger</h3>
              <div className="space-y-3">
                {mockTriggers.map((trigger) => (
                  <button
                    key={trigger.id}
                    onClick={() => handleTriggerSelect(trigger)}
                    className="w-full text-left p-3 border border-automation-border rounded-lg hover:bg-automation-block-hover transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{trigger.icon}</span>
                      <div>
                        <div className="font-medium">{trigger.name}</div>
                        <div className="text-sm text-automation-text-muted">{trigger.app}</div>
                        <div className="text-xs text-automation-text-secondary mt-1">
                          {trigger.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="border-t mt-4 pt-4">
                <button
                  onClick={() => {
                    setShowTriggerSelector(false);
                    setShowCustomBuilder(true);
                  }}
                  className="w-full p-3 border-2 border-dashed border-automation-primary text-automation-primary rounded-lg hover:bg-automation-primary-light transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Create Custom Trigger</span>
                  </div>
                </button>
              </div>
              
              <button
                onClick={() => setShowTriggerSelector(false)}
                className="mt-3 w-full automation-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Service Trigger Selector */}
        {showServiceTriggers && (
          <ServiceTriggerSelector
            onSelect={(trigger) => {
              onConfigure({
                appName: trigger.service,
                triggerName: trigger.name,
                description: trigger.description,
                appIcon: trigger.serviceIcon,
                serviceConfig: trigger
              });
              setShowServiceTriggers(false);
            }}
            onCancel={() => setShowServiceTriggers(false)}
            onManageServices={() => {
              setShowServiceTriggers(false);
              setShowServiceManager(true);
            }}
          />
        )}

        {/* Service Integration Manager */}
        {showServiceManager && (
          <ServiceIntegrationManager
            onClose={() => {
              setShowServiceManager(false);
              setShowServiceTriggers(true);
            }}
          />
        )}

        {/* Custom Trigger Builder */}
        {showCustomBuilder && (
          <CustomTriggerBuilder
            onSave={(trigger) => {
              onConfigure({
                appName: 'Custom',
                triggerName: trigger.name,
                description: trigger.description,
                appIcon: '⚙️',
                customConfig: trigger
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
    <div className="workflow-block workflow-block--configured relative group">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-automation-primary-light flex items-center justify-center">
            {data?.appIcon ? (
              <span className="text-xl">{data.appIcon}</span>
            ) : (
              <Zap className="w-6 h-6 text-automation-primary" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-automation-text-primary">
              {data?.triggerName || 'Configured Trigger'}
            </h3>
            <span className="text-xs bg-automation-primary text-white px-2 py-1 rounded-full">
              TRIGGER
            </span>
          </div>
          
          <div className="text-sm text-automation-text-secondary mb-2">
            {data?.appName}
          </div>
          
          <p className="text-sm text-automation-text-muted">
            {data?.description || 'Trigger configured and ready'}
          </p>
        </div>
        
        {/* Action buttons - shown on hover */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowTriggerSelector(true)}
            className="p-2 text-automation-text-muted hover:text-automation-primary transition-colors"
            aria-label="Edit trigger"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-automation-text-muted hover:text-automation-error transition-colors"
            aria-label="Delete trigger"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};