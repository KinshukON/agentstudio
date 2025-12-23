import { AgentGraph, AgentRun } from '@/types';

const GRAPHS_KEY = 'agent_studio_graphs';
const RUNS_KEY = 'agent_studio_runs';

export const storage = {
  // Graphs
  saveGraph(graph: AgentGraph): void {
    if (typeof window === 'undefined') return;
    const graphs = this.getGraphs();
    const index = graphs.findIndex(g => g.id === graph.id);
    if (index >= 0) {
      graphs[index] = graph;
    } else {
      graphs.push(graph);
    }
    localStorage.setItem(GRAPHS_KEY, JSON.stringify(graphs));
  },

  getGraphs(): AgentGraph[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(GRAPHS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getGraph(id: string): AgentGraph | null {
    const graphs = this.getGraphs();
    return graphs.find(g => g.id === id) || null;
  },

  deleteGraph(id: string): void {
    if (typeof window === 'undefined') return;
    const graphs = this.getGraphs().filter(g => g.id !== id);
    localStorage.setItem(GRAPHS_KEY, JSON.stringify(graphs));
  },

  // Runs
  saveRun(run: AgentRun): void {
    if (typeof window === 'undefined') return;
    const runs = this.getRuns();
    const index = runs.findIndex(r => r.id === run.id);
    if (index >= 0) {
      runs[index] = run;
    } else {
      runs.unshift(run); // Add to beginning
    }
    // Keep only last 50 runs
    const trimmed = runs.slice(0, 50);
    localStorage.setItem(RUNS_KEY, JSON.stringify(trimmed));
  },

  getRuns(): AgentRun[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(RUNS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getRun(id: string): AgentRun | null {
    const runs = this.getRuns();
    return runs.find(r => r.id === id) || null;
  },

  clearRuns(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(RUNS_KEY, JSON.stringify([]));
  },
};

