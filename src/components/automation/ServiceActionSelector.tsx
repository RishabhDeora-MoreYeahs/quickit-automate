import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

interface ServiceAction {
  id: string;
  name: string;
  service: string;
  serviceIcon: string;
  description: string;
  connected: boolean;
  configurable: boolean;
  inputFields?: { [key: string]: { type: string; required: boolean; description?: string } };
}

const serviceActions: ServiceAction[] = [
  {
    id: 'gmail-send-email',
    name: 'Send Email',
    service: 'Gmail',
    serviceIcon: '📧',
    description: 'Send an email to specified recipients',
    connected: true,
    configurable: true,
    inputFields: {
      to: { type: 'string', required: true, description: 'Recipient email address' },
      subject: { type: 'string', required: true, description: 'Email subject line' },
      body: { type: 'text', required: true, description: 'Email body content' },
      cc: { type: 'string', required: false, description: 'CC recipients' }
    }
  },
  {
    id: 'slack-send-message',
    name: 'Send Message',
    service: 'Slack',
    serviceIcon: '💬',
    description: 'Send a message to a channel or user',
    connected: false,
    configurable: true,
    inputFields: {
      channel: { type: 'string', required: true, description: 'Channel or user to send to' },
      message: { type: 'text', required: true, description: 'Message content' },
      username: { type: 'string', required: false, description: 'Bot username' }
    }
  },
  {
    id: 'twilio-send-sms',
    name: 'Send SMS',
    service: 'Twilio',
    serviceIcon: '📱',
    description: 'Send an SMS message',
    connected: false,
    configurable: true,
    inputFields: {
      to: { type: 'string', required: true, description: 'Phone number to send to' },
      body: { type: 'text', required: true, description: 'SMS message content' },
      from: { type: 'string', required: false, description: 'Sender phone number' }
    }
  },
  {
    id: 'hubspot-create-contact',
    name: 'Create Contact',
    service: 'HubSpot',
    serviceIcon: '🎯',
    description: 'Create a new contact in HubSpot',
    connected: false,
    configurable: true,
    inputFields: {
      email: { type: 'string', required: true, description: 'Contact email address' },
      first_name: { type: 'string', required: false, description: 'First name' },
      last_name: { type: 'string', required: false, description: 'Last name' },
      company: { type: 'string', required: false, description: 'Company name' }
    }
  },
  {
    id: 'airtable-create-record',
    name: 'Create Record',
    service: 'Airtable',
    serviceIcon: '📊',
    description: 'Add a new record to an Airtable base',
    connected: false,
    configurable: true,
    inputFields: {
      base_id: { type: 'string', required: true, description: 'Airtable base ID' },
      table_name: { type: 'string', required: true, description: 'Table name' },
      fields: { type: 'object', required: true, description: 'Record fields as JSON' }
    }
  },
  {
    id: 'microsoft-send-email',
    name: 'Send Outlook Email',
    service: 'Microsoft 365',
    serviceIcon: '🏢',
    description: 'Send an email via Outlook',
    connected: false,
    configurable: true,
    inputFields: {
      to: { type: 'string', required: true, description: 'Recipient email address' },
      subject: { type: 'string', required: true, description: 'Email subject' },
      body: { type: 'text', required: true, description: 'Email body' }
    }
  },
  {
    id: 'stripe-create-customer',
    name: 'Create Customer',
    service: 'Stripe',
    serviceIcon: '💳',
    description: 'Create a new customer in Stripe',
    connected: false,
    configurable: true,
    inputFields: {
      email: { type: 'string', required: true, description: 'Customer email' },
      name: { type: 'string', required: false, description: 'Customer name' },
      description: { type: 'text', required: false, description: 'Customer description' }
    }
  }
];

interface ServiceActionSelectorProps {
  onSelect: (action: ServiceAction) => void;
  onCancel: () => void;
  onManageServices: () => void;
}

export const ServiceActionSelector = ({ onSelect, onCancel, onManageServices }: ServiceActionSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const connectedServices = [...new Set(serviceActions.filter(a => a.connected).map(a => a.service))];
  const availableServices = [...new Set(serviceActions.map(a => a.service))];

  const filteredActions = selectedCategory === 'all' 
    ? serviceActions 
    : serviceActions.filter(a => a.service === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Select a Service Action</h3>
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
          {filteredActions.map((action) => (
            <button
              key={action.id}
              onClick={() => action.connected && onSelect(action)}
              disabled={!action.connected}
              className={`w-full text-left p-4 border rounded-lg transition-colors ${
                action.connected
                  ? 'border-automation-border hover:bg-automation-block-hover'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-automation-primary-light flex items-center justify-center text-2xl">
                  {action.serviceIcon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{action.name}</h4>
                    {action.connected ? (
                      <Badge variant="default" className="text-xs">Connected</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Not Connected</Badge>
                    )}
                  </div>
                  <div className="text-sm text-automation-text-muted mb-1">{action.service}</div>
                  <p className="text-xs text-automation-text-secondary mb-2">
                    {action.description}
                  </p>
                  {action.inputFields && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-automation-text-secondary mr-2">Inputs:</span>
                      {Object.entries(action.inputFields).slice(0, 3).map(([field, config]) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}{config.required ? '*' : ''}
                        </Badge>
                      ))}
                      {Object.keys(action.inputFields).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.keys(action.inputFields).length - 3} more
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