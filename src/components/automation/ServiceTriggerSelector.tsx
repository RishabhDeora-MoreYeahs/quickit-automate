import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

interface ServiceTrigger {
  id: string;
  name: string;
  service: string;
  serviceIcon: string;
  description: string;
  connected: boolean;
  configurable: boolean;
  outputFields?: { [key: string]: string };
}

const serviceTriggers: ServiceTrigger[] = [
  {
    id: 'gmail-new-email',
    name: 'New Email Received',
    service: 'Gmail',
    serviceIcon: '📧',
    description: 'Triggers when you receive a new email',
    connected: true,
    configurable: true,
    outputFields: {
      from: 'string',
      subject: 'string',
      body: 'string',
      timestamp: 'date'
    }
  },
  {
    id: 'slack-new-message',
    name: 'New Channel Message',
    service: 'Slack',
    serviceIcon: '💬',
    description: 'Triggers when a message is posted in a channel',
    connected: false,
    configurable: true,
    outputFields: {
      user: 'string',
      message: 'string',
      channel: 'string',
      timestamp: 'date'
    }
  },
  {
    id: 'stripe-payment-success',
    name: 'Payment Successful',
    service: 'Stripe',
    serviceIcon: '💳',
    description: 'Triggers when a payment is successfully processed',
    connected: false,
    configurable: true,
    outputFields: {
      amount: 'number',
      currency: 'string',
      customer_email: 'string',
      payment_id: 'string'
    }
  },
  {
    id: 'hubspot-new-contact',
    name: 'New Contact Created',
    service: 'HubSpot',
    serviceIcon: '🎯',
    description: 'Triggers when a new contact is added',
    connected: false,
    configurable: true,
    outputFields: {
      contact_id: 'string',
      email: 'string',
      first_name: 'string',
      last_name: 'string'
    }
  },
  {
    id: 'airtable-new-record',
    name: 'New Record Added',
    service: 'Airtable',
    serviceIcon: '📊',
    description: 'Triggers when a new record is added to a table',
    connected: false,
    configurable: true,
    outputFields: {
      record_id: 'string',
      created_time: 'date',
      fields: 'object'
    }
  },
  {
    id: 'microsoft-new-email',
    name: 'New Outlook Email',
    service: 'Microsoft 365',
    serviceIcon: '🏢',
    description: 'Triggers when you receive a new email in Outlook',
    connected: false,
    configurable: true,
    outputFields: {
      from: 'string',
      subject: 'string',
      body: 'string',
      received_time: 'date'
    }
  }
];

interface ServiceTriggerSelectorProps {
  onSelect: (trigger: ServiceTrigger) => void;
  onCancel: () => void;
  onManageServices: () => void;
}

export const ServiceTriggerSelector = ({ onSelect, onCancel, onManageServices }: ServiceTriggerSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const connectedServices = [...new Set(serviceTriggers.filter(t => t.connected).map(t => t.service))];
  const availableServices = [...new Set(serviceTriggers.map(t => t.service))];

  const filteredTriggers = selectedCategory === 'all' 
    ? serviceTriggers 
    : serviceTriggers.filter(t => t.service === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Select a Service Trigger</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onManageServices}>
              <Settings className="w-4 h-4 mr-2" />
              Manage Services
            </Button>
            <Button variant="ghost" onClick={onCancel}>×</Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Services
          </Button>
          {availableServices.map((service) => (
            <Button
              key={service}
              variant={selectedCategory === service ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(service)}
            >
              {service}
            </Button>
          ))}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTriggers.map((trigger) => (
            <button
              key={trigger.id}
              onClick={() => trigger.connected && onSelect(trigger)}
              disabled={!trigger.connected}
              className={`w-full text-left p-4 border rounded-lg transition-colors ${
                trigger.connected
                  ? 'border-automation-border hover:bg-automation-block-hover'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-automation-primary-light flex items-center justify-center text-2xl">
                  {trigger.serviceIcon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{trigger.name}</h4>
                    {trigger.connected ? (
                      <Badge variant="default" className="text-xs">Connected</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Not Connected</Badge>
                    )}
                  </div>
                  <div className="text-sm text-automation-text-muted mb-1">{trigger.service}</div>
                  <p className="text-xs text-automation-text-secondary mb-2">
                    {trigger.description}
                  </p>
                  {trigger.outputFields && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-automation-text-secondary mr-2">Output:</span>
                      {Object.entries(trigger.outputFields).slice(0, 3).map(([field, type]) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                      {Object.keys(trigger.outputFields).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.keys(trigger.outputFields).length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {connectedServices.length === 0 && (
          <div className="text-center py-8 text-automation-text-secondary">
            <p className="mb-4">No services connected yet.</p>
            <Button onClick={onManageServices}>
              Connect Your First Service
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t mt-6">
          <p className="text-sm text-automation-text-secondary">
            {connectedServices.length} services connected
          </p>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};