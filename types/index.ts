export type NodeType =
  | 'goal'
  | 'prompt'
  | 'planner'
  | 'memory'
  | 'tool'
  | 'policy'
  | 'humanApproval'
  | 'output';

export type ToolType =
  | 'SimWebSearch'
  | 'SimCRM'
  | 'SimTicket';

export interface BaseNodeData {
  label: string;
  type: NodeType;
}

export interface GoalNodeData extends BaseNodeData {
  type: 'goal';
  goal: string;
}

export interface PromptNodeData extends BaseNodeData {
  type: 'prompt';
  template: string;
  variables: string[];
}

export interface PlannerNodeData extends BaseNodeData {
  type: 'planner';
  maxSteps: number;
  strategy: 'sequential' | 'parallel' | 'adaptive';
}

export interface MemoryNodeData extends BaseNodeData {
  type: 'memory';
  memoryKey: string;
  operation: 'read' | 'write' | 'append';
}

export interface ToolNodeData extends BaseNodeData {
  type: 'tool';
  toolType: ToolType;
  parameters: Record<string, any>;
}

export interface PolicyNodeData extends BaseNodeData {
  type: 'policy';
  rules: PolicyRule[];
}

export interface PolicyRule {
  id: string;
  condition: string;
  action: 'allow' | 'deny' | 'warn';
  message?: string;
}

export interface HumanApprovalNodeData extends BaseNodeData {
  type: 'humanApproval';
  prompt: string;
  requireApproval: boolean;
}

export interface OutputNodeData extends BaseNodeData {
  type: 'output';
  format: 'text' | 'json' | 'markdown';
}

export type AgentNodeData =
  | GoalNodeData
  | PromptNodeData
  | PlannerNodeData
  | MemoryNodeData
  | ToolNodeData
  | PolicyNodeData
  | HumanApprovalNodeData
  | OutputNodeData;

export interface AgentNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: AgentNodeData;
}

export interface AgentEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface AgentGraph {
  id: string;
  name: string;
  description: string;
  nodes: AgentNode[];
  edges: AgentEdge[];
  metadata: {
    created: string;
    modified: string;
    version: string;
  };
}

export interface ExecutionContext {
  memory: Record<string, any>;
  variables: Record<string, any>;
  stepCount: number;
  maxSteps: number;
  aborted: boolean;
  errors: string[];
}

export interface TraceEntry {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeType: NodeType;
  nodeName: string;
  inputSummary: string;
  outputSummary: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentRun {
  id: string;
  agentId: string;
  agentName: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed' | 'aborted';
  trace: TraceEntry[];
  finalOutput?: any;
  error?: string;
  mode: 'sandbox' | 'byok';
}

export interface RunRequest {
  graph: AgentGraph;
  mode: 'sandbox' | 'byok';
  apiKey?: string;
  model?: string;
  initialContext?: Record<string, any>;
}

export interface RunResponse {
  runId: string;
  status: 'completed' | 'failed' | 'aborted';
  trace: TraceEntry[];
  finalOutput?: any;
  error?: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'support' | 'research' | 'workflow';
  graph: AgentGraph;
  tags: string[];
}

