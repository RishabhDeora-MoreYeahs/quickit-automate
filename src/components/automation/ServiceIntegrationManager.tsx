import { useState } from 'react';
import { Settings, Plus, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  capabilities: ('triggers' | 'actions')[];
  authType: 'oauth' | 'api-key' | 'webhook';
}

const availableServices: Service[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    description: 'Send and receive emails',
    connected: false,
    capabilities: ['triggers', 'actions'],
    authType: 'oauth'
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    description: 'Send messages and notifications',
    connected: false,
    capabilities: ['triggers', 'actions'],
    authType: 'oauth'
  },
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    icon: '🏢',
    description: 'Access Outlook, Teams, and Office apps',
    connected: false,
    capabilities: ['triggers', 'actions'],
    authType: 'oauth'
  },
  {
    id: 'twilio',
    name: 'Twilio',
    icon: '📱',
    description: 'Send SMS and make phone calls',
    connected: false,
    capabilities: ['actions'],
    authType: 'api-key'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: '🎯',
    description: 'Manage contacts and deals',
    connected: false,
    capabilities: ['triggers', 'actions'],
    authType: 'api-key'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '💳',
    description: 'Handle payments and subscriptions',
    connected: false,
    capabilities: ['triggers', 'actions'],
    authType: 'api-key'
  },
  {
    id: 'airtable',
    name: 'Airtable',
    icon: '📊',
    description: 'Manage databases and records',
    connected: false,
    capabilities: ['triggers', 'actions'],
    authType: 'api-key'
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    icon: '📈',
    description: 'Read and write spreadsheet data',
    connected: false,
    capabilities: ['triggers', 'actions'],
    authType: 'oauth'
  }
];

interface ServiceIntegrationManagerProps {
  onClose: () => void;
  onServiceToggle?: (serviceId: string, connected: boolean) => void;
}

export const ServiceIntegrationManager = ({ onClose, onServiceToggle }: ServiceIntegrationManagerProps) => {
  const [services, setServices] = useState(availableServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleServiceConnect = (service: Service) => {
    // Mock connection logic - in real app this would handle OAuth/API key flows
    setServices(prev => 
      prev.map(s => 
        s.id === service.id 
          ? { ...s, connected: !s.connected }
          : s
      )
    );
    onServiceToggle?.(service.id, !service.connected);
    setSelectedService(null);
  };

  const renderConnectionForm = (service: Service) => {
    if (service.authType === 'oauth') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-automation-text-secondary">
            Click below to authenticate with {service.name} using OAuth
          </p>
          <Button 
            onClick={() => handleServiceConnect(service)}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Connect to {service.name}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">API Key</label>
          <input 
            type="password"
            placeholder={`Enter your ${service.name} API key`}
            className="w-full mt-1 px-3 py-2 border border-automation-border rounded-lg focus:outline-none focus:ring-2 focus:ring-automation-primary"
          />
        </div>
        <Button 
          onClick={() => handleServiceConnect(service)}
          className="w-full"
        >
          Connect {service.name}
        </Button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Service Integrations</h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        {selectedService ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-12 h-12 rounded-lg bg-automation-primary-light flex items-center justify-center text-2xl">
                {selectedService.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedService.name}</h3>
                <p className="text-automation-text-secondary">{selectedService.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Capabilities</h4>
                <div className="flex gap-2">
                  {selectedService.capabilities.map(cap => (
                    <Badge key={cap} variant="secondary">
                      {cap === 'triggers' ? 'Can trigger automations' : 'Can perform actions'}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedService.connected ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Connected</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    This service is ready to use in your automations
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => handleServiceConnect(selectedService)}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-medium">Connect {selectedService.name}</h4>
                  {renderConnectionForm(selectedService)}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="ghost" onClick={() => setSelectedService(null)}>
                ← Back to Services
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="p-4 border border-automation-border rounded-lg hover:bg-automation-block-hover transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-automation-primary-light flex items-center justify-center text-xl">
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{service.name}</h3>
                        {service.connected && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-automation-text-secondary mb-2">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {service.capabilities.map(cap => (
                          <Badge key={cap} variant="outline" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-automation-text-secondary">
                {services.filter(s => s.connected).length} of {services.length} services connected
              </p>
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};