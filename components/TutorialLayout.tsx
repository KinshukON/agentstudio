'use client';

import { useTutorial } from './TutorialPanel';

export function TutorialLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useTutorial();
  
  return (
    <div className="flex min-h-screen">
      {/* Main content - adjusts when tutorial is open */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isOpen ? 'md:ml-0' : ''
        }`}
      >
        {children}
      </main>
    </div>
  );
}

