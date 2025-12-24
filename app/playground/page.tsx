'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AgentGraph, AgentRun } from '@/types';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Play, Lock, Unlock, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function PlaygroundPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [graphs, setGraphs] = useState<AgentGraph[]>([]);
  const [selectedGraphId, setSelectedGraphId] = useState<string | null>(null);
  const [mode, setMode] = useState<'sandbox' | 'byok'>('sandbox');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const allGraphs = storage.getGraphs();
    setGraphs(allGraphs);

    const graphId = searchParams.get('id');
    if (graphId && allGraphs.some(g => g.id === graphId)) {
      setSelectedGraphId(graphId);
    } else if (allGraphs.length > 0) {
      setSelectedGraphId(allGraphs[0].id);
    }
  }, [searchParams]);

  const handleRun = async () => {
    if (!selectedGraphId) {
      setError('Please select an agent to run');
      return;
    }

    const graph = storage.getGraph(selectedGraphId);
    if (!graph) {
      setError('Agent not found');
      return;
    }

    if (mode === 'byok' && !apiKey) {
      setError('API key is required for BYOK mode');
      return;
    }

    if (graph.nodes.length === 0) {
      setError('Agent has no nodes');
      return;
    }

    setRunning(true);
    setError(null);

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          graph,
          mode,
          apiKey: mode === 'byok' ? apiKey : undefined,
          model: mode === 'byok' ? model : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run agent');
      }

      const runData: AgentRun = await response.json();
      
      // Save run to storage
      storage.saveRun(runData);

      // Navigate to runs page with the run ID
      router.push(`/runs?id=${runData.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while running the agent');
    } finally {
      setRunning(false);
    }
  };

  const selectedGraph = selectedGraphId ? storage.getGraph(selectedGraphId) : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Playground</h1>
          <p className="text-muted-foreground">
            Run your agents in sandbox mode or bring your own OpenAI API key.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Agent Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Agent</CardTitle>
              <CardDescription>Choose an agent to run</CardDescription>
            </CardHeader>
            <CardContent>
              {graphs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">No agents found</p>
                  <Button variant="outline" onClick={() => router.push('/templates')}>
                    Browse Templates
                  </Button>
                </div>
              ) : (
                <select
                  value={selectedGraphId || ''}
                  onChange={(e) => setSelectedGraphId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {graphs.map((graph) => (
                    <option key={graph.id} value={graph.id}>
                      {graph.name}
                    </option>
                  ))}
                </select>
              )}

              {selectedGraph && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
                  <p className="font-medium mb-2">{selectedGraph.name}</p>
                  <p className="text-muted-foreground text-xs mb-2">
                    {selectedGraph.description}
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Nodes: {selectedGraph.nodes.length}</span>
                    <span>Edges: {selectedGraph.edges.length}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Execution Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Execution Mode</CardTitle>
              <CardDescription>Choose how to run the agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={mode === 'sandbox' ? 'primary' : 'outline'}
                  onClick={() => setMode('sandbox')}
                  className="flex-1"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Sandbox
                </Button>
                <Button
                  variant={mode === 'byok' ? 'primary' : 'outline'}
                  onClick={() => setMode('byok')}
                  className="flex-1"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  BYOK
                </Button>
              </div>

              {mode === 'sandbox' ? (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-900 dark:text-green-100">
                    <strong>Sandbox Mode:</strong> Uses simulated tools and data. Safe for experimentation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="apiKey">OpenAI API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your key is never stored or logged
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <select
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-destructive/90">{error}</p>
            </div>
          </div>
        )}

        {/* Run Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleRun}
            disabled={running || !selectedGraphId}
          >
            {running ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Run Agent
              </>
            )}
          </Button>
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-lg border">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Safe Execution</h3>
            <p className="text-sm text-muted-foreground">
              Built-in guardrails prevent runaway agents
            </p>
          </div>
          <div className="text-center p-6 rounded-lg border">
            <CheckCircle2 className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Full Traces</h3>
            <p className="text-sm text-muted-foreground">
              Inspect every step of execution
            </p>
          </div>
          <div className="text-center p-6 rounded-lg border">
            <CheckCircle2 className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">No Storage</h3>
            <p className="text-sm text-muted-foreground">
              API keys never leave your browser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

