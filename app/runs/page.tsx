'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AgentRun, TraceEntry } from '@/types';
import { storage } from '@/lib/storage';
import { formatTimestamp } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle2, XCircle, AlertCircle, Clock, Trash2, ChevronRight } from 'lucide-react';

function StatusBadge({ status }: { status: AgentRun['status'] }) {
  const variants = {
    completed: { icon: CheckCircle2, color: 'text-green-600 bg-green-50 dark:bg-green-950', label: 'Completed' },
    failed: { icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-950', label: 'Failed' },
    aborted: { icon: AlertCircle, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950', label: 'Aborted' },
    running: { icon: Clock, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950', label: 'Running' },
  };

  const variant = variants[status];
  const Icon = variant.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variant.color}`}>
      <Icon className="h-3.5 w-3.5" />
      {variant.label}
    </div>
  );
}

function TraceViewer({ trace }: { trace: TraceEntry[] }) {
  return (
    <div className="space-y-3">
      {trace.map((entry, index) => (
        <div
          key={entry.id}
          className={`p-4 rounded-lg border ${entry.error ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : 'bg-card'}`}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-medium">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-medium text-sm">{entry.nodeName}</h4>
                  <p className="text-xs text-muted-foreground">
                    {entry.nodeType} • {new Date(entry.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {entry.error && (
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Input:</span>{' '}
                  <span className="text-foreground">{entry.inputSummary}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Output:</span>{' '}
                  <span className="text-foreground">{entry.outputSummary}</span>
                </div>
                {entry.error && (
                  <div className="mt-2 p-2 rounded bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 text-xs">
                    <strong>Error:</strong> {entry.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RunsPage() {
  const searchParams = useSearchParams();
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<AgentRun | null>(null);

  useEffect(() => {
    loadRuns();
    const runId = searchParams.get('id');
    if (runId) {
      const run = storage.getRun(runId);
      if (run) {
        setSelectedRun(run);
      }
    }
  }, [searchParams]);

  const loadRuns = () => {
    const allRuns = storage.getRuns();
    setRuns(allRuns);
  };

  const handleClearAll = () => {
    if (confirm('Clear all run history? This cannot be undone.')) {
      storage.clearRuns();
      setRuns([]);
      setSelectedRun(null);
    }
  };

  const handleSelectRun = (run: AgentRun) => {
    setSelectedRun(run);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Runs List */}
      <div className="w-96 border-r bg-muted/30 overflow-y-auto">
        <div className="p-4 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Run History</h2>
            {runs.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {runs.length} run{runs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {runs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="mb-4">No runs yet</p>
            <p className="text-sm">Run an agent in the playground to see execution history here.</p>
          </div>
        ) : (
          <div className="p-2">
            {runs.map((run) => (
              <button
                key={run.id}
                onClick={() => handleSelectRun(run)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  selectedRun?.id === run.id
                    ? 'bg-primary/10 border border-primary'
                    : 'hover:bg-muted border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-sm truncate">{run.agentName}</h3>
                  <StatusBadge status={run.status} />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(run.startTime)}
                  </div>
                  <div>Steps: {run.trace.length}</div>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${run.mode === 'sandbox' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    {run.mode === 'sandbox' ? 'Sandbox' : 'BYOK'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Run Details */}
      <div className="flex-1 overflow-y-auto">
        {!selectedRun ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <ChevronRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a run to view details</p>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-6 py-8 max-w-4xl">
            {/* Run Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{selectedRun.agentName}</h1>
                  <p className="text-muted-foreground">
                    Run ID: {selectedRun.id.split('-')[0]}...
                  </p>
                </div>
                <StatusBadge status={selectedRun.status} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Started</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium">{formatTimestamp(selectedRun.startTime)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Steps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedRun.trace.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Mode</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium capitalize">{selectedRun.mode}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Duration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium">
                      {selectedRun.endTime
                        ? `${Math.round((new Date(selectedRun.endTime).getTime() - new Date(selectedRun.startTime).getTime()) / 1000)}s`
                        : 'In progress'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Error Display */}
            {selectedRun.error && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive mb-1">Run Failed</p>
                    <p className="text-sm text-destructive/90">{selectedRun.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Final Output */}
            {selectedRun.finalOutput && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Final Output</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const dataStr = JSON.stringify(selectedRun.trace, null, 2);
                        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                        const exportFileDefaultName = `trace-${selectedRun.id.split('-')[0]}.json`;
                        const linkElement = document.createElement('a');
                        linkElement.setAttribute('href', dataUri);
                        linkElement.setAttribute('download', exportFileDefaultName);
                        linkElement.click();
                      }}
                    >
                      Export Trace as JSON
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled
                      className="opacity-50"
                      title="Coming in v2"
                    >
                      Compare Runs (v2)
                    </Button>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                    {typeof selectedRun.finalOutput === 'string'
                      ? selectedRun.finalOutput
                      : JSON.stringify(selectedRun.finalOutput, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Execution Trace */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Execution Trace</h2>
              {selectedRun.trace.length === 0 ? (
                <p className="text-muted-foreground">No trace entries</p>
              ) : (
                <TraceViewer trace={selectedRun.trace} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

