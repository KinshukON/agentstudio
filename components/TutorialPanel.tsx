'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { X, ChevronRight, CheckCircle2, Play, RotateCcw } from 'lucide-react';

// Context to manage tutorial state across components
const TutorialContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const useTutorial = () => useContext(TutorialContext);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <TutorialContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </TutorialContext.Provider>
  );
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  page: string;
  action?: string;
  checkmark?: string;
  highlight?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Agent Studio!',
    description: 'Let\'s test the Support Agent together. This interactive tutorial will guide you through each step. Click "Next" when you\'re ready to begin.',
    page: '/',
    action: 'Click Next to start',
  },
  {
    id: 'navigate-templates',
    title: 'Step 1: Go to Templates',
    description: 'Click on the "Templates" link in the navigation bar at the top of the page. This will show you all available agent templates.',
    page: '/',
    action: 'Click "Templates" in the header',
    checkmark: 'You\'re on the Templates page!',
  },
  {
    id: 'view-support-agent',
    title: 'Step 2: Find Support Agent',
    description: 'You should see three templates. Look for the "Support Agent" card - it handles customer support tickets by analyzing CRM data.',
    page: '/templates',
    action: 'Locate the Support Agent card',
  },
  {
    id: 'use-template',
    title: 'Step 3: Use the Template',
    description: 'Click the "Use Template" button on the Support Agent card. This will load the pre-configured agent into the builder.',
    page: '/templates',
    action: 'Click "Use Template" on Support Agent',
    checkmark: 'Template loaded in Builder!',
  },
  {
    id: 'view-builder',
    title: 'Step 4: Explore the Builder',
    description: 'Welcome to the visual builder! Here\'s what you see:\n\n**On the Canvas (center):**\n5 connected nodes showing the agent flow:\n\n1️⃣ Support Goal (blue circle icon)\n   • This is where the agent starts\n   • Click on it to see its properties →\n\n2️⃣ Fetch CRM Data (orange wrench icon)\n   • Gets at-risk customers\n   • Connected by an arrow ↓\n\n3️⃣ Fetch Tickets (orange wrench icon)\n   • Gets open support tickets\n\n4️⃣ Create Action Plan (purple squares icon)\n   • Analyzes data and creates plan\n\n5️⃣ Support Summary (teal document icon)\n   • Generates the final report\n\n**Try this:** Click on any node to see its configuration in the right panel!\n\nWhen ready, click the "Save" button at the top.',
    page: '/builder',
    action: 'Click any node to explore, then click "Save"',
    checkmark: 'Agent saved!',
  },
  {
    id: 'navigate-playground',
    title: 'Step 5: Go to Playground',
    description: 'Now let\'s run the agent! Click "Playground" in the navigation bar. This is where you execute agents and see their output.',
    page: '/builder',
    action: 'Click "Playground" in the header',
    checkmark: 'You\'re in the Playground!',
  },
  {
    id: 'select-agent',
    title: 'Step 6: Select Your Agent',
    description: 'Now let\'s configure the execution:\n\n**Step 6a:** Find the dropdown at the top that says "Select Agent"\n• Click on it\n• You\'ll see "Support Agent" in the list\n• Click to select it\n\n**Step 6b:** Check the mode selector\n• Make sure "Sandbox" is selected (not BYOK)\n• Sandbox = No API key needed\n• Uses simulated customer data\n\nYou should now see the agent name and description appear below the dropdown.',
    page: '/playground',
    action: 'Select "Support Agent" and ensure "Sandbox" mode',
  },
  {
    id: 'run-agent',
    title: 'Step 7: Run the Agent! 🚀',
    description: '**Find the blue "Run" button** at the top right (it has a play icon ▶️)\n\n**Click it and watch the magic happen:**\n\n⏱️ Execution starts (takes 2-3 seconds)\n\nYou\'ll see each node execute in real-time:\n\n1. ✅ Goal Node sets objective\n2. ✅ CRM Tool fetches 1 at-risk customer\n   → TechStart Inc (Health: 45/100)\n3. ✅ Ticket Tool fetches 2 open tickets\n4. ✅ Planner analyzes and creates plan\n5. ✅ Output generates report\n\n**What to expect:**\nA professional markdown report will appear below, showing customer health scores, tickets, and actionable recommendations!\n\nKeep watching - the output will appear automatically.',
    page: '/playground',
    action: 'Click the blue "Run" button (top right)',
    checkmark: 'Agent is running...',
  },
  {
    id: 'view-results',
    title: 'Step 8: View the Results',
    description: '**Scroll down** to see the output section.\n\nYou should see a beautifully formatted report:\n\n📊 **Executive Summary**\n• 🔴 1 at-risk customer identified\n• 📋 2 open/in-progress tickets\n• ⚠️ 1 high-priority issue\n\n👥 **Critical Customers**\nDetailed breakdown of TechStart Inc:\n• Health Score: 45/100 🔴 (below 50 = at risk!)\n• MRR: $500\n• Renewal: 2024-03-20\n• Active Tickets: 2\n\n🔥 **High Priority Issues:**\n• Login issues on mobile app\n• Dark mode feature request\n\n✅ **Recommended Actions**\n5 specific steps with customer names and ticket IDs\n\n**This is intelligent analysis!** The agent:\n• Connected customer health to ticket volume\n• Prioritized by urgency\n• Generated specific, actionable recommendations\n\nTake a moment to read through the report.',
    page: '/playground',
    action: 'Read the generated report',
  },
  {
    id: 'view-trace',
    title: 'Step 9: Explore the Trace (Optional)',
    description: '**Want to see how it worked behind the scenes?**\n\nLook for the execution section above the output.\n\nYou\'ll see a timeline of each step:\n\n🔍 **Trace Shows:**\n• Node name (e.g., "Support Goal")\n• Status (✅ Success or ❌ Failed)\n• Summary (e.g., "CRM query: 1 customers found")\n• Timestamp\n• Execution time\n\n**Click on any step** to see:\n• Input data\n• Output data\n• Node configuration\n\nThis is incredibly useful for:\n• Understanding agent behavior\n• Debugging issues\n• Learning how nodes work together\n\n**Pro tip:** Try running the agent again and compare the traces!',
    page: '/playground',
    action: 'Explore the trace (optional)',
  },
  {
    id: 'visit-runs',
    title: 'Step 10: Check Run History',
    description: 'Click "Runs" in the navigation to see all your past executions. You can:\n\n• View previous runs\n• Compare results\n• Export traces as JSON\n• Delete old runs\n\nYour Support Agent run is saved here!',
    page: '/playground',
    action: 'Click "Runs" in the header (optional)',
  },
  {
    id: 'complete',
    title: '🎉 Tutorial Complete!',
    description: 'Congratulations! You\'ve successfully:\n\n✅ Loaded the Support Agent template\n✅ Explored the visual builder\n✅ Executed the agent in Sandbox mode\n✅ Viewed intelligent, context-aware output\n✅ Learned about trace debugging\n\nNext steps:\n• Modify the agent in the Builder\n• Try the Research or Workflow agents\n• Build your own custom agent\n• Read SUPPORT_AGENT_GUIDE.md for details\n\nHappy building! 🚀',
    page: '/',
    action: 'Tutorial complete!',
  },
];

export function TutorialPanel() {
  const { isOpen, setIsOpen } = useTutorial();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  // Auto-advance based on page navigation
  useEffect(() => {
    if (!isOpen) return;

    const step = tutorialSteps[currentStep];
    if (!step) return;

    // Check if we're on the expected page for the next step
    if (step.checkmark && pathname === step.page) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, step.id]));
    }

    // Auto-advance to next step when on the right page
    if (currentStep < tutorialSteps.length - 1) {
      const nextStep = tutorialSteps[currentStep + 1];
      if (nextStep && pathname === nextStep.page && !completedSteps.has(nextStep.id)) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setCompletedSteps(prev => new Set([...prev, step.id]));
        }, 500);
      }
    }
  }, [pathname, isOpen, currentStep, completedSteps]);

  const startTutorial = () => {
    setIsOpen(true);
    setCurrentStep(0);
    setCompletedSteps(new Set());
  };

  const closeTutorial = () => {
    setIsOpen(false);
  };

  const goNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, tutorialSteps[currentStep].id]));
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
  };

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  if (!isOpen) {
    return (
      <Button
        onClick={startTutorial}
        className="fixed bottom-6 right-6 shadow-lg z-50 rounded-full h-14 px-6 hidden md:flex"
        size="lg"
      >
        <Play className="mr-2 h-5 w-5" />
        Start Tutorial
      </Button>
    );
  }

  return (
    <aside className="hidden md:flex w-96 bg-background border-r shadow-xl flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-primary/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">Interactive Tutorial</h3>
          <Button
            onClick={closeTutorial}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {completedSteps.has(step.id) ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <span className="text-sm font-bold text-primary">{currentStep + 1}</span>
                )}
              </div>
              <CardTitle className="text-base leading-tight">{step.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {step.description}
            </p>

            {step.action && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                <p className="text-sm font-medium text-primary flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  {step.action}
                </p>
              </div>
            )}

            {step.checkmark && completedSteps.has(step.id) && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {step.checkmark}
                </p>
              </div>
            )}

            {/* Step-specific hints */}
            {step.id === 'view-builder' && (
              <div className="text-xs text-muted-foreground space-y-1 mt-2 p-2 bg-muted/50 rounded">
                <p>💡 <strong>Tip:</strong> You can click on any node to see its properties in the right panel.</p>
              </div>
            )}

            {step.id === 'run-agent' && (
              <div className="text-xs text-muted-foreground space-y-1 mt-2 p-2 bg-muted/50 rounded">
                <p>💡 <strong>Tip:</strong> Sandbox mode is safe - it uses simulated data and doesn't require an API key!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-background space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={goBack}
            variant="outline"
            disabled={currentStep === 0}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={goNext}
            disabled={currentStep === tutorialSteps.length - 1}
            className="flex-1"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        {currentStep === tutorialSteps.length - 1 && (
          <Button
            onClick={restart}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart Tutorial
          </Button>
        )}
      </div>
    </aside>
  );
}

