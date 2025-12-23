import {
  AgentNodeData,
  ExecutionContext,
  GoalNodeData,
  PromptNodeData,
  PlannerNodeData,
  MemoryNodeData,
  ToolNodeData,
  PolicyNodeData,
  HumanApprovalNodeData,
  OutputNodeData,
} from '@/types';
import { simWebSearch, simCRMQuery, simTicketQuery } from './sandbox-data';
import { truncate } from './utils';

export interface NodeExecutionResult {
  output: any;
  summary: string;
  error?: string;
}

export async function executeNode(
  nodeData: AgentNodeData,
  context: ExecutionContext,
  mode: 'sandbox' | 'byok' = 'sandbox'
): Promise<NodeExecutionResult> {
  try {
    switch (nodeData.type) {
      case 'goal':
        return executeGoalNode(nodeData, context);
      case 'prompt':
        return executePromptNode(nodeData, context, mode);
      case 'planner':
        return executePlannerNode(nodeData, context);
      case 'memory':
        return executeMemoryNode(nodeData, context);
      case 'tool':
        return executeToolNode(nodeData, context);
      case 'policy':
        return executePolicyNode(nodeData, context);
      case 'humanApproval':
        return executeHumanApprovalNode(nodeData, context);
      case 'output':
        return executeOutputNode(nodeData, context);
      default:
        throw new Error(`Unknown node type: ${(nodeData as any).type}`);
    }
  } catch (error: any) {
    return {
      output: null,
      summary: 'Error',
      error: error.message || 'Unknown error',
    };
  }
}

function executeGoalNode(
  nodeData: GoalNodeData,
  context: ExecutionContext
): NodeExecutionResult {
  const goal = nodeData.goal || 'No goal specified';
  context.variables['goal'] = goal;
  return {
    output: goal,
    summary: `Goal set: ${truncate(goal, 60)}`,
  };
}

async function executePromptNode(
  nodeData: PromptNodeData,
  context: ExecutionContext,
  mode: 'sandbox' | 'byok'
): Promise<NodeExecutionResult> {
  let prompt = nodeData.template || '';
  
  // Replace variables
  for (const varName of nodeData.variables || []) {
    const value = context.variables[varName] || '';
    prompt = prompt.replace(new RegExp(`\\{${varName}\\}`, 'g'), value);
  }
  
  if (mode === 'sandbox') {
    // Simulate LLM response
    const response = `[Simulated response to: ${truncate(prompt, 50)}]`;
    context.variables['lastPromptResponse'] = response;
    return {
      output: response,
      summary: `Prompt executed (sandbox)`,
    };
  } else {
    // This would be handled by API route in BYOK mode
    context.variables['lastPrompt'] = prompt;
    return {
      output: prompt,
      summary: 'Prompt prepared for LLM',
    };
  }
}

function executePlannerNode(
  nodeData: PlannerNodeData,
  context: ExecutionContext
): NodeExecutionResult {
  const goal = context.variables['goal'] || 'No goal set';
  const maxSteps = nodeData.maxSteps || 5;
  
  // Heuristic planning - generate a simple plan
  const plan = {
    goal,
    steps: [
      { step: 1, action: 'Gather context and requirements' },
      { step: 2, action: 'Analyze available data' },
      { step: 3, action: 'Generate solution approach' },
      { step: 4, action: 'Execute and validate' },
      { step: 5, action: 'Deliver results' },
    ].slice(0, maxSteps),
    strategy: nodeData.strategy || 'sequential',
  };
  
  context.variables['plan'] = plan;
  return {
    output: plan,
    summary: `Plan created: ${maxSteps} steps (${nodeData.strategy})`,
  };
}

function executeMemoryNode(
  nodeData: MemoryNodeData,
  context: ExecutionContext
): NodeExecutionResult {
  const key = nodeData.memoryKey || 'default';
  const operation = nodeData.operation || 'read';
  
  switch (operation) {
    case 'read':
      const value = context.memory[key];
      return {
        output: value,
        summary: `Read memory[${key}]: ${value ? 'found' : 'empty'}`,
      };
    
    case 'write':
      const writeValue = context.variables['lastOutput'] || context.variables['lastPromptResponse'];
      context.memory[key] = writeValue;
      return {
        output: writeValue,
        summary: `Wrote to memory[${key}]`,
      };
    
    case 'append':
      const appendValue = context.variables['lastOutput'] || context.variables['lastPromptResponse'];
      if (!context.memory[key]) {
        context.memory[key] = [];
      }
      if (Array.isArray(context.memory[key])) {
        context.memory[key].push(appendValue);
      }
      return {
        output: context.memory[key],
        summary: `Appended to memory[${key}]`,
      };
    
    default:
      throw new Error(`Unknown memory operation: ${operation}`);
  }
}

function executeToolNode(
  nodeData: ToolNodeData,
  context: ExecutionContext
): NodeExecutionResult {
  const toolType = nodeData.toolType;
  const params = nodeData.parameters || {};
  
  switch (toolType) {
    case 'SimWebSearch':
      const query = params.query || context.variables['query'] || 'default search';
      const results = simWebSearch(query);
      context.variables['searchResults'] = results;
      return {
        output: results,
        summary: `Web search: "${truncate(query, 40)}" (${results.length} results)`,
      };
    
    case 'SimCRM':
      const crmResults = simCRMQuery(params.filters);
      context.variables['crmResults'] = crmResults;
      return {
        output: crmResults,
        summary: `CRM query: ${crmResults.length} customers found`,
      };
    
    case 'SimTicket':
      const ticketResults = simTicketQuery(params.filters);
      context.variables['ticketResults'] = ticketResults;
      return {
        output: ticketResults,
        summary: `Ticket query: ${ticketResults.length} tickets found`,
      };
    
    default:
      throw new Error(`Unknown tool type: ${toolType}`);
  }
}

function executePolicyNode(
  nodeData: PolicyNodeData,
  context: ExecutionContext
): NodeExecutionResult {
  const rules = nodeData.rules || [];
  const violations: string[] = [];
  
  for (const rule of rules) {
    // Simple policy evaluation
    if (rule.condition === 'max_output_length') {
      const lastOutput = context.variables['lastOutput'] || '';
      if (typeof lastOutput === 'string' && lastOutput.length > 1000) {
        if (rule.action === 'deny') {
          violations.push(rule.message || 'Output too long');
        }
      }
    }
    
    if (rule.condition === 'no_sensitive_data') {
      const lastOutput = JSON.stringify(context.variables['lastOutput'] || '');
      const sensitivePatterns = /password|api[_-]?key|secret|token/gi;
      if (sensitivePatterns.test(lastOutput)) {
        if (rule.action === 'deny') {
          violations.push(rule.message || 'Sensitive data detected');
        }
      }
    }
  }
  
  if (violations.length > 0) {
    context.aborted = true;
    return {
      output: { violations },
      summary: 'Policy violations detected',
      error: violations.join('; '),
    };
  }
  
  return {
    output: { passed: true },
    summary: `Policy check passed (${rules.length} rules)`,
  };
}

function executeHumanApprovalNode(
  nodeData: HumanApprovalNodeData,
  context: ExecutionContext
): NodeExecutionResult {
  // In sandbox mode, auto-approve
  // In real implementation, this would pause execution
  const prompt = nodeData.prompt || 'Approve to continue?';
  const approved = true; // Auto-approve for MVP
  
  context.variables['humanApproved'] = approved;
  
  return {
    output: { approved, prompt },
    summary: approved ? 'Human approval: Approved (auto)' : 'Human approval: Denied',
  };
}

function executeOutputNode(
  nodeData: OutputNodeData,
  context: ExecutionContext
): NodeExecutionResult {
  const format = nodeData.format || 'text';
  const data = context.variables['lastOutput'] || context.variables['lastPromptResponse'] || context.memory;
  
  let formattedOutput: any;
  
  switch (format) {
    case 'json':
      formattedOutput = JSON.stringify(data, null, 2);
      break;
    case 'markdown':
      formattedOutput = `# Output\n\n${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`;
      break;
    default:
      formattedOutput = typeof data === 'string' ? data : JSON.stringify(data);
  }
  
  context.variables['finalOutput'] = formattedOutput;
  
  return {
    output: formattedOutput,
    summary: `Output generated (${format})`,
  };
}

