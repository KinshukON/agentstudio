import { AgentTemplate } from '@/types';

export const templates: AgentTemplate[] = [
  {
    id: 'support-agent',
    name: 'Support Agent',
    description: 'Handles customer support tickets by analyzing CRM data and ticket history',
    category: 'support',
    tags: ['customer-support', 'crm', 'tickets'],
    graph: {
      id: 'support-agent',
      name: 'Support Agent',
      description: 'Customer support automation agent',
      nodes: [
        {
          id: 'goal-1',
          type: 'goal',
          position: { x: 100, y: 100 },
          data: {
            label: 'Support Goal',
            type: 'goal',
            goal: 'Analyze customer tickets and provide support recommendations',
          },
        },
        {
          id: 'tool-1',
          type: 'tool',
          position: { x: 100, y: 200 },
          data: {
            label: 'Fetch CRM Data',
            type: 'tool',
            toolType: 'SimCRM',
            parameters: { filters: { status: 'at-risk' } },
          },
        },
        {
          id: 'tool-2',
          type: 'tool',
          position: { x: 100, y: 300 },
          data: {
            label: 'Fetch Tickets',
            type: 'tool',
            toolType: 'SimTicket',
            parameters: { filters: { status: 'open' } },
          },
        },
        {
          id: 'planner-1',
          type: 'planner',
          position: { x: 100, y: 400 },
          data: {
            label: 'Create Action Plan',
            type: 'planner',
            maxSteps: 5,
            strategy: 'sequential',
          },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 100, y: 500 },
          data: {
            label: 'Support Summary',
            type: 'output',
            format: 'markdown',
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'goal-1', target: 'tool-1' },
        { id: 'e2', source: 'tool-1', target: 'tool-2' },
        { id: 'e3', source: 'tool-2', target: 'planner-1' },
        { id: 'e4', source: 'planner-1', target: 'output-1' },
      ],
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0',
      },
    },
  },
  {
    id: 'research-agent',
    name: 'Research Agent',
    description: 'Conducts web research and synthesizes information on a given topic',
    category: 'research',
    tags: ['research', 'web-search', 'analysis'],
    graph: {
      id: 'research-agent',
      name: 'Research Agent',
      description: 'Automated research and synthesis agent',
      nodes: [
        {
          id: 'goal-1',
          type: 'goal',
          position: { x: 100, y: 100 },
          data: {
            label: 'Research Goal',
            type: 'goal',
            goal: 'Research and synthesize information on AI agent frameworks',
          },
        },
        {
          id: 'memory-1',
          type: 'memory',
          position: { x: 100, y: 200 },
          data: {
            label: 'Initialize Memory',
            type: 'memory',
            memoryKey: 'research_findings',
            operation: 'write',
          },
        },
        {
          id: 'tool-1',
          type: 'tool',
          position: { x: 100, y: 300 },
          data: {
            label: 'Web Search',
            type: 'tool',
            toolType: 'SimWebSearch',
            parameters: { query: 'ai agent frameworks' },
          },
        },
        {
          id: 'prompt-1',
          type: 'prompt',
          position: { x: 100, y: 400 },
          data: {
            label: 'Synthesize Results',
            type: 'prompt',
            template: 'Synthesize the following research on {goal}',
            variables: ['goal'],
          },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 100, y: 500 },
          data: {
            label: 'Research Report',
            type: 'output',
            format: 'markdown',
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'goal-1', target: 'memory-1' },
        { id: 'e2', source: 'memory-1', target: 'tool-1' },
        { id: 'e3', source: 'tool-1', target: 'prompt-1' },
        { id: 'e4', source: 'prompt-1', target: 'output-1' },
      ],
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0',
      },
    },
  },
  {
    id: 'workflow-agent',
    name: 'Workflow Agent',
    description: 'Orchestrates multi-step workflows with approval gates and policy checks',
    category: 'workflow',
    tags: ['workflow', 'orchestration', 'governance'],
    graph: {
      id: 'workflow-agent',
      name: 'Workflow Agent',
      description: 'Multi-step workflow orchestration with governance',
      nodes: [
        {
          id: 'goal-1',
          type: 'goal',
          position: { x: 100, y: 50 },
          data: {
            label: 'Workflow Goal',
            type: 'goal',
            goal: 'Execute governed workflow with approval gates',
          },
        },
        {
          id: 'policy-1',
          type: 'policy',
          position: { x: 100, y: 150 },
          data: {
            label: 'Initial Policy Check',
            type: 'policy',
            rules: [
              {
                id: 'r1',
                condition: 'no_sensitive_data',
                action: 'deny',
                message: 'No sensitive data allowed',
              },
            ],
          },
        },
        {
          id: 'planner-1',
          type: 'planner',
          position: { x: 100, y: 250 },
          data: {
            label: 'Plan Steps',
            type: 'planner',
            maxSteps: 4,
            strategy: 'sequential',
          },
        },
        {
          id: 'human-1',
          type: 'humanApproval',
          position: { x: 100, y: 350 },
          data: {
            label: 'Human Approval',
            type: 'humanApproval',
            prompt: 'Approve workflow execution?',
            requireApproval: true,
          },
        },
        {
          id: 'tool-1',
          type: 'tool',
          position: { x: 100, y: 450 },
          data: {
            label: 'Execute Action',
            type: 'tool',
            toolType: 'SimCRM',
            parameters: {},
          },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 100, y: 550 },
          data: {
            label: 'Workflow Result',
            type: 'output',
            format: 'json',
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'goal-1', target: 'policy-1' },
        { id: 'e2', source: 'policy-1', target: 'planner-1' },
        { id: 'e3', source: 'planner-1', target: 'human-1' },
        { id: 'e4', source: 'human-1', target: 'tool-1' },
        { id: 'e5', source: 'tool-1', target: 'output-1' },
      ],
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0',
      },
    },
  },
];

export function getTemplate(id: string): AgentTemplate | undefined {
  return templates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: 'support' | 'research' | 'workflow'): AgentTemplate[] {
  return templates.filter(t => t.category === category);
}

