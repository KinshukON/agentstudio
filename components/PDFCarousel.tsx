'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

interface PDFCarouselProps {
  pdfUrl: string;
}

export default function PDFCarousel({ pdfUrl }: PDFCarouselProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Estimate number of pages (you can update this manually or detect it)
    // For now, we'll use a reasonable default
    setNumPages(50); // Adjust based on your PDF
    setIsLoading(false);
  }, []);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= numPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading book viewer...</p>
        </div>
      </div>
    );
  }

  // Prevent right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-background p-4"
      onContextMenu={handleContextMenu}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}
    >
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">AI Agents at Work</h1>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {numPages}
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="relative bg-card border rounded-lg overflow-hidden shadow-lg">
          <div 
            className="bg-muted/30 relative" 
            style={{ height: 'calc(80vh - 25px)', overflow: 'hidden' }}
            onContextMenu={handleContextMenu}
          >
            <iframe
              src={`${pdfUrl}#page=${currentPage}&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
              title={`PDF Page ${currentPage}`}
              style={{ border: 'none', overflow: 'hidden', userSelect: 'none', pointerEvents: 'auto' }}
            />
            {/* Transparent overlay to prevent screenshots and selections */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            />
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 p-0 shadow-lg disabled:opacity-50"
            variant="default"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 p-0 shadow-lg disabled:opacity-50"
            variant="default"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={numPages}
              value={currentPage}
              onChange={handlePageInput}
              className="w-16 px-2 py-1 text-center border rounded"
            />
            <span className="text-sm text-muted-foreground">of {numPages}</span>
          </div>

          <Button
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            variant="outline"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
