# Agent Architecture Guide

## What is an Agent?

In Agent Studio, an **agent** is a directed graph of interconnected nodes that execute sequentially to accomplish a goal. Each agent is a visual representation of an agentic AI system with built-in orchestration, memory, tools, and governance.

## Agent Anatomy

### Core Components

```
Agent = Nodes + Edges + Execution Context
```

**Nodes**: Individual processing units (Goal, Prompt, Tool, etc.)  
**Edges**: Connections defining execution flow  
**Context**: Shared memory and variables during execution

## Node Types Deep Dive

### 1. Goal Node 🎯
**Purpose**: Define the agent's objective

**Configuration**:
- `goal`: String describing what the agent should accomplish

**Execution**:
- Sets `goal` variable in context
- Available to all downstream nodes
- Used for planning and prompt generation

**Example Use Cases**:
- "Analyze customer churn risk"
- "Generate quarterly report"
- "Automate support ticket triage"

**Best Practices**:
- Be specific and measurable
- Avoid ambiguous goals
- Include success criteria when possible

---

### 2. Prompt Node 💬
**Purpose**: Generate LLM prompts with variable substitution

**Configuration**:
- `template`: Prompt text with `{variable}` placeholders
- `variables`: Array of variable names to substitute

**Execution**:
- Replaces `{varName}` with context variables
- In sandbox: Returns simulated response
- In BYOK: Sends to OpenAI API

**Example**:
```json
{
  "template": "Analyze the following customer: {customerName}\nHealth Score: {healthScore}\nProvide retention strategy.",
  "variables": ["customerName", "healthScore"]
}
```

**Best Practices**:
- Use clear variable names
- Include context in prompts
- Test with sandbox first
- Keep prompts focused on one task

---

### 3. Planner Node 🗺️
**Purpose**: Generate execution plans heuristically

**Configuration**:
- `maxSteps`: Maximum planning steps (1-10)
- `strategy`: Planning approach
  - `sequential`: Steps execute in order
  - `parallel`: Steps can run concurrently
  - `adaptive`: Dynamic adjustment based on results

**Execution**:
- Analyzes goal from context
- Generates step-by-step plan
- Stores plan in context

**Example Output**:
```json
{
  "goal": "Reduce customer churn",
  "steps": [
    { "step": 1, "action": "Gather customer data" },
    { "step": 2, "action": "Analyze engagement patterns" },
    { "step": 3, "action": "Identify at-risk customers" },
    { "step": 4, "action": "Generate retention strategies" }
  ],
  "strategy": "sequential"
}
```

**Best Practices**:
- Start with 3-5 steps
- Use sequential for predictable workflows
- Use adaptive for exploration tasks

---

### 4. Memory Node 🧠
**Purpose**: Persist and retrieve data across agent execution

**Configuration**:
- `memoryKey`: Unique identifier for memory slot
- `operation`: read | write | append

**Execution**:
- **Read**: Retrieves value from memory
- **Write**: Stores current output to memory
- **Append**: Adds to array in memory

**Example Pattern**:
```
Memory(write, "customer_list") → Tool(fetch_crm) → Memory(read, "customer_list")
```

**Best Practices**:
- Use descriptive keys
- Initialize before reading
- Use append for accumulating results
- Clear memory between runs if needed

---

### 5. Tool Node 🔧
**Purpose**: Execute simulated or real actions

**Available Tools**:

#### SimWebSearch
Simulates web search queries
```json
{
  "toolType": "SimWebSearch",
  "parameters": {
    "query": "customer retention strategies 2024"
  }
}
```
**Returns**: Array of search results with title, snippet, URL

#### SimCRM
Simulates CRM database queries
```json
{
  "toolType": "SimCRM",
  "parameters": {
    "filters": {
      "status": "at-risk",
      "tier": "Enterprise",
      "minHealthScore": 40
    }
  }
}
```
**Returns**: Array of customer records

#### SimTicket
Simulates support ticket system
```json
{
  "toolType": "SimTicket",
  "parameters": {
    "filters": {
      "status": "open",
      "priority": "high",
      "customerId": "CUST-001"
    }
  }
}
```
**Returns**: Array of support tickets

**Best Practices**:
- Test in sandbox first
- Validate parameters
- Handle empty results gracefully
- Store results in memory for reuse

---

### 6. Policy Node 🛡️
**Purpose**: Enforce governance rules and safety checks

**Configuration**:
- `rules`: Array of policy rules

**Rule Structure**:
```json
{
  "id": "rule-1",
  "condition": "max_output_length",
  "action": "deny",
  "message": "Output exceeds maximum length"
}
```

**Available Conditions**:
- `max_output_length`: Checks if output > 1000 chars
- `no_sensitive_data`: Detects passwords, API keys, secrets

**Actions**:
- `allow`: Passes check, logs warning
- `deny`: Aborts execution with error
- `warn`: Continues but logs warning

**Best Practices**:
- Place early in agent flow
- Use `deny` for critical policies
- Combine multiple rules
- Test policy violations

---

### 7. Human Approval Node ✋
**Purpose**: Manual approval gates for critical decisions

**Configuration**:
- `prompt`: Message shown to approver
- `requireApproval`: Boolean flag

**Execution**:
- **Sandbox**: Auto-approves (for testing)
- **Production**: Would pause and wait for human input

**Example Use Cases**:
- Approve budget changes
- Review generated content
- Confirm deletion operations
- Validate sensitive actions

**Best Practices**:
- Use for irreversible actions
- Provide clear context in prompt
- Include what's being approved
- Test flow with auto-approve first

---

### 8. Output Node 📤
**Purpose**: Format and present final results

**Configuration**:
- `format`: text | json | markdown

**Execution**:
- Gathers accumulated context
- Formats according to specification
- Sets as final output

**Format Examples**:

**Text**:
```
Simple string output for display
```

**JSON**:
```json
{
  "status": "completed",
  "results": [...],
  "summary": "..."
}
```

**Markdown**:
```markdown
# Results Report

## Summary
Analysis complete...

## Details
- Finding 1
- Finding 2
```

**Best Practices**:
- Place at end of agent flow
- Match format to use case
- Include key results only
- Test formatting with various inputs

---

## Agent Execution Flow

### Topological Execution
Agents execute in dependency order:

```
Goal → Planner → Tool → Memory → Output
  ↓       ↓        ↓       ↓        ↓
 step1  step2   step3   step4   step5
```

### Execution Context
Shared state across all nodes:

```typescript
{
  memory: {
    customer_list: [...],
    findings: [...]
  },
  variables: {
    goal: "Reduce churn",
    lastOutput: {...},
    crmResults: [...]
  },
  stepCount: 5,
  maxSteps: 12,
  aborted: false,
  errors: []
}
```

### Trace Generation
Every node execution creates a trace entry:

```typescript
{
  id: "trace-123",
  timestamp: "2024-01-20T10:30:00Z",
  nodeId: "node-1",
  nodeType: "tool",
  nodeName: "Fetch CRM Data",
  inputSummary: "Variables: goal, plan",
  outputSummary: "CRM query: 3 customers found",
  error?: "Optional error message"
}
```

---

## Guardrails System

### Built-in Safety Measures

#### 1. Step Limit
- **Default**: 12 steps maximum
- **Purpose**: Prevent infinite loops
- **Configurable**: In executor.ts

#### 2. Output Size Limit
- **Default**: 5000 characters
- **Purpose**: Prevent memory exhaustion
- **Applies**: To serialized context

#### 3. Loop Detection
- **Method**: State hashing
- **Detects**: Repeated memory/variable states
- **Action**: Aborts execution

#### 4. Policy Enforcement
- **Custom Rules**: User-defined policies
- **Built-in Checks**: Sensitive data detection
- **Actions**: Allow, Warn, Deny

### Execution Bounds

```typescript
const GUARDRAILS = {
  MAX_STEPS: 12,
  MAX_OUTPUT_LENGTH: 5000,
  LOOP_DETECTION: true,
  POLICY_ENFORCEMENT: true
}
```

---

## Agent Design Patterns

### Pattern 1: Linear Pipeline
**Use Case**: Sequential data processing

```
Goal → Tool → Transform → Output
```

**Example**: Research agent that searches, synthesizes, formats

---

### Pattern 2: Gather-Process-Distribute
**Use Case**: Multi-source data aggregation

```
Goal → Tool1 → Memory(append)
    ↓ Tool2 → Memory(append)
    ↓ Tool3 → Memory(append)
    ↓ Memory(read) → Planner → Output
```

**Example**: Support agent gathering CRM + Tickets + History

---

### Pattern 3: Governed Workflow
**Use Case**: Compliance-critical operations

```
Goal → Policy → Planner → Human Approval → Tool → Policy → Output
```

**Example**: Financial transaction agent with approval gates

---

### Pattern 4: Iterative Refinement
**Use Case**: Quality-focused generation

```
Goal → Prompt → Evaluate → Memory
         ↑                      ↓
         └──────(loop)──────────┘
```

**Example**: Content generation with feedback loop (manual in MVP)

---

## Building Your First Agent

### Step-by-Step Guide

#### 1. Define Goal
Start with a clear, measurable objective:
```
"Identify at-risk customers and generate retention strategies"
```

#### 2. Sketch Data Flow
Map out what data you need:
- Input: Customer segments
- Tools: CRM, Ticket system
- Output: Prioritized action list

#### 3. Add Nodes
```
Goal → SimCRM (at-risk customers) 
    → SimTicket (open issues)
    → Memory (store findings)
    → Planner (create action plan)
    → Output (markdown report)
```

#### 4. Configure Each Node
Set parameters:
- CRM filters: `status: "at-risk"`
- Memory key: `findings`
- Planner: 5 steps, sequential
- Output: markdown format

#### 5. Test in Sandbox
Run with simulated data first

#### 6. Review Trace
Check each step executed correctly

#### 7. Refine & Export
Adjust based on results, export JSON

---

## Advanced Topics

### Variable Propagation
Variables flow through context:

```typescript
Goal → sets `goal` variable
Tool → sets `crmResults` variable
Prompt → reads `goal`, `crmResults`
```

### Memory Patterns

**Short-term Memory** (within run):
```
Memory(write) → ... → Memory(read)
```

**Accumulation** (across nodes):
```
Tool1 → Memory(append)
Tool2 → Memory(append)
Tool3 → Memory(append)
Planner → Memory(read) → uses all accumulated data
```

### Error Handling

Errors are captured in trace:
```typescript
{
  nodeId: "tool-1",
  error: "CRM connection failed",
  outputSummary: "Error during execution"
}
```

Agent continues or aborts based on severity.

---

## Integration with Kaggle

### Use Cases for Kaggle Integration

#### 1. Dataset-Driven Agents
Replace sandbox data with real Kaggle datasets:
- Customer churn datasets
- Support ticket datasets
- Sales data for analysis

#### 2. Model Integration
Use Kaggle notebooks to:
- Train ML models
- Generate predictions
- Export results for agents

#### 3. Notebook Execution
Agents could trigger Kaggle notebooks:
- Pass parameters
- Execute analysis
- Retrieve results

#### 4. Competition Integration
Build agents that:
- Fetch competition data
- Run experiments
- Submit results

### Implementation Ideas

**Option A: Kaggle API Tool Node**
```json
{
  "toolType": "KaggleDataset",
  "parameters": {
    "dataset": "username/dataset-name",
    "operation": "download",
    "files": ["data.csv"]
  }
}
```

**Option B: Notebook Execution**
```json
{
  "toolType": "KaggleNotebook",
  "parameters": {
    "notebook": "username/notebook-name",
    "inputs": {"param1": "value1"},
    "waitForCompletion": true
  }
}
```

**Option C: Model Hosting**
- Train models in Kaggle
- Host via Kaggle API
- Call from Agent Studio tools

### Getting Started with Kaggle

1. **Get API Key**: Kaggle Account → Settings → API
2. **Add Tool Node**: Implement Kaggle API wrapper
3. **Test with Public Dataset**: Start with simple data fetch
4. **Expand**: Add notebook execution, model calls

---

## Performance Optimization

### Agent Efficiency Tips

1. **Minimize Steps**: Combine operations when possible
2. **Reuse Memory**: Store expensive operations
3. **Parallel Tools**: Use planner's parallel strategy
4. **Cache Results**: Store in memory for reuse
5. **Limit Output**: Only return necessary data

### Execution Time Targets
- Simple agents: <2 seconds
- Complex agents: <5 seconds
- Maximum (Vercel): <10 seconds

---

## Debugging Agents

### Using Traces

1. **Identify Failed Node**: Look for errors in trace
2. **Check Inputs**: Review inputSummary
3. **Validate Config**: Ensure parameters are correct
4. **Test Isolation**: Run node independently
5. **Fix & Rerun**: Update and test again

### Common Issues

**Empty Results**:
- Check tool parameters
- Verify data exists
- Review filter conditions

**Execution Aborted**:
- Check guardrails (step limit)
- Review policy violations
- Look for loops

**Missing Variables**:
- Ensure upstream nodes set variables
- Check node execution order
- Verify variable names match

---

## Export & Deployment

### Agent JSON Format

```json
{
  "id": "agent-123",
  "name": "Customer Retention Agent",
  "description": "Identifies at-risk customers",
  "nodes": [...],
  "edges": [...],
  "metadata": {
    "created": "2024-01-20T10:00:00Z",
    "modified": "2024-01-20T12:00:00Z",
    "version": "1.0"
  }
}
```

### Sharing Agents

1. **Export JSON**: Click Export in builder
2. **Version Control**: Commit to Git
3. **Share Link**: Host on GitHub
4. **Import**: Others can import and customize
5. **Template Library**: Contribute to community

---

## Best Practices Summary

### Design
✅ Start simple, add complexity gradually  
✅ Use templates as starting points  
✅ Test each node independently  
✅ Keep graphs readable (avoid spaghetti)

### Safety
✅ Always add policy nodes for sensitive operations  
✅ Use human approval for critical decisions  
✅ Test in sandbox before BYOK  
✅ Monitor step counts and output sizes

### Performance
✅ Minimize node count  
✅ Reuse memory instead of re-fetching  
✅ Use specific tool filters  
✅ Keep prompts concise

### Maintenance
✅ Document agent purpose clearly  
✅ Use descriptive node labels  
✅ Version agents with metadata  
✅ Export backups regularly

---

## Resources

- **Quick Start**: See QUICKSTART.md
- **API Reference**: See types/index.ts
- **Examples**: Load templates in /templates
- **Deployment**: See DEPLOYMENT.md
- **Architecture**: See STRUCTURE.md

---

## Contributing Agent Patterns

Want to share your agent patterns?

1. Export your agent as JSON
2. Document the use case
3. Include sample trace output
4. Submit as template contribution
5. Help others learn!

---

## License

This documentation and Agent Studio are released under the MIT License.
See LICENSE file for details.

---

**Built with Agent Studio** - Learn agentic AI by building agents, not reading diagrams.

