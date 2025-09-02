import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Settings, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-automation-primary-light via-background to-automation-canvas">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-automation-primary flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-automation-text-primary">
              AutoFlow
            </h1>
          </div>
          <p className="text-xl text-automation-text-secondary max-w-2xl mx-auto">
            Create powerful workflow automations without coding. Connect your favorite apps and automate repetitive tasks in minutes.
          </p>
        </header>

        {/* Main CTA */}
        <div className="text-center mb-20">
          <a href="/automate">
            <Button className="automation-btn-primary text-lg px-8 py-4 inline-flex items-center gap-3 mb-6">
              Create Your First Automation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
          <p className="text-automation-text-muted">
            No credit card required • Free to start
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-automation-border">
            <div className="w-12 h-12 rounded-lg bg-automation-primary-light flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-automation-primary" />
            </div>
            <h3 className="text-xl font-semibold text-automation-text-primary mb-3">
              Visual Workflow Builder
            </h3>
            <p className="text-automation-text-secondary">
              Build complex automations with our intuitive drag-and-drop interface. No coding required.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-automation-border">
            <div className="w-12 h-12 rounded-lg bg-automation-secondary text-white flex items-center justify-center mb-4">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-automation-text-primary mb-3">
              500+ Integrations
            </h3>
            <p className="text-automation-text-secondary">
              Connect with all your favorite apps and services. From Gmail to Slack, we've got you covered.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-automation-border">
            <div className="w-12 h-12 rounded-lg bg-automation-warning text-white flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-automation-text-primary mb-3">
              Smart Analytics
            </h3>
            <p className="text-automation-text-secondary">
              Track your automation performance and optimize your workflows with detailed insights.
            </p>
          </div>
        </div>

        {/* Example Workflows */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-automation-text-primary mb-8">
            Popular Automation Examples
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg border border-automation-border text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">📧</span>
                <h4 className="font-semibold">Email to Task Automation</h4>
              </div>
              <p className="text-sm text-automation-text-secondary">
                Automatically create tasks from important emails and notify your team in Slack.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-automation-border text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">📅</span>
                <h4 className="font-semibold">Meeting Prep Automation</h4>
              </div>
              <p className="text-sm text-automation-text-secondary">
                Create meeting rooms, send calendar invites, and prepare agenda docs automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
