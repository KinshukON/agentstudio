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
    description: 'You\'re now in the visual builder! You can see the agent\'s flow:\n\n• Goal Node (blue) - Sets the objective\n• CRM Tool (orange) - Fetches customer data\n• Ticket Tool (orange) - Fetches support tickets\n• Planner (purple) - Creates action plan\n• Output (teal) - Generates report\n\nFeel free to explore, then click "Save" to store this agent.',
    page: '/builder',
    action: 'Click "Save" button',
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
    description: 'In the dropdown menu at the top, select "Support Agent" (the one you just saved). Make sure "Sandbox" mode is selected - this uses simulated data, no API key needed.',
    page: '/playground',
    action: 'Select "Support Agent" from dropdown',
  },
  {
    id: 'run-agent',
    title: 'Step 7: Run the Agent! 🚀',
    description: 'Click the "Run" button to execute the Support Agent. Watch as it:\n\n1. Fetches at-risk customers from CRM\n2. Retrieves open support tickets\n3. Analyzes the data\n4. Creates a context-aware plan\n5. Generates an intelligent report\n\nThis should take just a few seconds!',
    page: '/playground',
    action: 'Click the "Run" button',
    checkmark: 'Agent is running...',
  },
  {
    id: 'view-results',
    title: 'Step 8: View the Results',
    description: 'Scroll down to see the intelligent output! The Support Agent has generated a professional markdown report with:\n\n• Executive summary with key metrics\n• At-risk customer details (TechStart Inc)\n• Open tickets with priorities\n• Context-aware action plan\n• Specific next steps\n\nThis is real AI-powered analysis from the sandbox data!',
    page: '/playground',
    action: 'Scroll down to view output',
  },
  {
    id: 'view-trace',
    title: 'Step 9: Explore the Trace',
    description: 'Click "View Trace" to see exactly how the agent executed:\n\n• Each node that ran\n• Data collected at each step\n• Time taken per operation\n• Final output\n\nThis transparency helps you understand and debug agent behavior.',
    page: '/playground',
    action: 'Click "View Trace" (optional)',
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
    <aside className="hidden md:flex w-96 bg-background border-r shadow-xl flex-col shrink-0">
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

