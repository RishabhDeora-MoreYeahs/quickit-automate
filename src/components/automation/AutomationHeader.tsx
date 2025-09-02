interface AutomationHeaderProps {
  isAutomationOn: boolean;
  onToggleAutomation: (enabled: boolean) => void;
  canSave: boolean;
  onSave: () => void;
}

export const AutomationHeader = ({
  isAutomationOn,
  onToggleAutomation,
  canSave,
  onSave
}: AutomationHeaderProps) => {
  return (
    <header className="border-b border-automation-border bg-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left side - Title */}
        <div>
          <h1 className="text-2xl font-semibold text-automation-text-primary">
            Create New Automation
          </h1>
        </div>

        {/* Right side - Toggle and Save button */}
        <div className="flex items-center gap-6">
          {/* Automation Toggle */}
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium transition-colors ${
              isAutomationOn 
                ? 'text-automation-success' 
                : 'text-automation-text-muted'
            }`}>
              Automation is {isAutomationOn ? 'ON' : 'OFF'}
            </span>
            <button
              onClick={() => onToggleAutomation(!isAutomationOn)}
              className={`automation-toggle ${isAutomationOn ? 'automation-toggle--active' : ''}`}
              aria-label={`Turn automation ${isAutomationOn ? 'off' : 'on'}`}
            >
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={!canSave}
            className="automation-btn-primary"
          >
            Save Automation
          </button>
        </div>
      </div>
    </header>
  );
};