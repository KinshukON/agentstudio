import {
  AgentGraph,
  AgentNode,
  AgentEdge,
  ExecutionContext,
  TraceEntry,
  AgentRun,
} from '@/types';
import { executeNode } from './node-handlers';
import { generateId, truncate } from './utils';

const MAX_STEPS = 12;
const MAX_OUTPUT_LENGTH = 5000;

export class GraphExecutor {
  private graph: AgentGraph;
  private mode: 'sandbox' | 'byok';
  private context: ExecutionContext;
  private trace: TraceEntry[];
  private nodeMap: Map<string, AgentNode>;
  private adjacencyList: Map<string, string[]>;
  private visitedStates: Set<string>;

  constructor(graph: AgentGraph, mode: 'sandbox' | 'byok' = 'sandbox') {
    this.graph = graph;
    this.mode = mode;
    this.context = {
      memory: {},
      variables: {},
      stepCount: 0,
      maxSteps: MAX_STEPS,
      aborted: false,
      errors: [],
    };
    this.trace = [];
    this.nodeMap = new Map();
    this.adjacencyList = new Map();
    this.visitedStates = new Set();

    this.buildGraph();
  }

  private buildGraph(): void {
    // Build node map
    for (const node of this.graph.nodes) {
      this.nodeMap.set(node.id, node);
      this.adjacencyList.set(node.id, []);
    }

    // Build adjacency list
    for (const edge of this.graph.edges) {
      const targets = this.adjacencyList.get(edge.source) || [];
      targets.push(edge.target);
      this.adjacencyList.set(edge.source, targets);
    }
  }

  private getStartNodes(): AgentNode[] {
    // Nodes with no incoming edges
    const hasIncoming = new Set<string>();
    for (const edge of this.graph.edges) {
      hasIncoming.add(edge.target);
    }

    return this.graph.nodes.filter(node => !hasIncoming.has(node.id));
  }

  private topologicalSort(): AgentNode[] {
    const sorted: AgentNode[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (nodeId: string): void => {
      if (visited.has(nodeId)) return;
      if (visiting.has(nodeId)) {
        throw new Error('Cycle detected in graph');
      }

      visiting.add(nodeId);

      // Visit all nodes that this node depends on (reverse edges)
      for (const edge of this.graph.edges) {
        if (edge.target === nodeId) {
          visit(edge.source);
        }
      }

      visiting.delete(nodeId);
      visited.add(nodeId);

      const node = this.nodeMap.get(nodeId);
      if (node) {
        sorted.push(node);
      }
    };

    for (const node of this.graph.nodes) {
      visit(node.id);
    }

    return sorted;
  }

  private detectRepeatedState(): boolean {
    const stateHash = JSON.stringify({
      variables: this.context.variables,
      memory: this.context.memory,
    });

    if (this.visitedStates.has(stateHash)) {
      return true; // Loop detected
    }

    this.visitedStates.add(stateHash);
    return false;
  }

  private checkGuardrails(): string | null {
    // Max steps
    if (this.context.stepCount >= this.context.maxSteps) {
      return `Maximum steps (${this.context.maxSteps}) exceeded`;
    }

    // Repeated state detection
    if (this.detectRepeatedState()) {
      return 'Repeated state detected - possible infinite loop';
    }

    // Max output length
    const outputStr = JSON.stringify(this.context.variables);
    if (outputStr.length > MAX_OUTPUT_LENGTH) {
      return 'Output length exceeded maximum allowed';
    }

    return null;
  }

  private async executeNodeSafely(node: AgentNode): Promise<void> {
    const startTime = new Date().toISOString();

    try {
      this.context.stepCount++;

      // Check guardrails before execution
      const guardrailError = this.checkGuardrails();
      if (guardrailError) {
        this.context.aborted = true;
        this.trace.push({
          id: generateId(),
          timestamp: startTime,
          nodeId: node.id,
          nodeType: node.data.type,
          nodeName: node.data.label,
          inputSummary: 'Guardrail check',
          outputSummary: '',
          error: guardrailError,
        });
        return;
      }

      // Execute the node
      const result = await executeNode(node.data, this.context, this.mode);

      // Store output in context
      this.context.variables['lastOutput'] = result.output;

      // Create trace entry
      const traceEntry: TraceEntry = {
        id: generateId(),
        timestamp: startTime,
        nodeId: node.id,
        nodeType: node.data.type,
        nodeName: node.data.label,
        inputSummary: this.summarizeContext(),
        outputSummary: result.summary,
        error: result.error,
      };

      this.trace.push(traceEntry);

      // Check if node execution caused an error
      if (result.error) {
        this.context.errors.push(result.error);
      }

    } catch (error: any) {
      const errorMessage = error.message || 'Unknown execution error';
      this.context.errors.push(errorMessage);
      this.context.aborted = true;

      this.trace.push({
        id: generateId(),
        timestamp: startTime,
        nodeId: node.id,
        nodeType: node.data.type,
        nodeName: node.data.label,
        inputSummary: 'Error during execution',
        outputSummary: '',
        error: errorMessage,
      });
    }
  }

  private summarizeContext(): string {
    const keys = Object.keys(this.context.variables);
    if (keys.length === 0) return 'Empty context';
    return `Variables: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}`;
  }

  async execute(): Promise<AgentRun> {
    const runId = generateId();
    const startTime = new Date().toISOString();

    try {
      // Get execution order
      const executionOrder = this.topologicalSort();

      // Execute nodes in order
      for (const node of executionOrder) {
        if (this.context.aborted) {
          break;
        }

        await this.executeNodeSafely(node);
      }

      const endTime = new Date().toISOString();
      const status = this.context.aborted
        ? 'aborted'
        : this.context.errors.length > 0
        ? 'failed'
        : 'completed';

      const run: AgentRun = {
        id: runId,
        agentId: this.graph.id,
        agentName: this.graph.name,
        startTime,
        endTime,
        status,
        trace: this.trace,
        finalOutput: this.context.variables['finalOutput'] || this.context.variables['lastOutput'],
        error: this.context.errors.length > 0 ? this.context.errors.join('; ') : undefined,
        mode: this.mode,
      };

      return run;
    } catch (error: any) {
      const endTime = new Date().toISOString();
      return {
        id: runId,
        agentId: this.graph.id,
        agentName: this.graph.name,
        startTime,
        endTime,
        status: 'failed',
        trace: this.trace,
        error: error.message || 'Execution failed',
        mode: this.mode,
      };
    }
  }
}

export async function executeGraph(
  graph: AgentGraph,
  mode: 'sandbox' | 'byok' = 'sandbox'
): Promise<AgentRun> {
  const executor = new GraphExecutor(graph, mode);
  return await executor.execute();
}

