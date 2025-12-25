# Support Agent - Operational Guide

## Overview

The Support Agent is now **fully operational** and generates **intelligent, actionable insights** from customer data and support tickets.

## What It Does

### 🎯 **Core Capabilities**

1. **Customer Health Analysis**
   - Identifies at-risk customers based on health scores
   - Correlates customer tier and MRR with support activity
   - Tracks renewal dates for proactive engagement

2. **Ticket Intelligence**
   - Analyzes open and in-progress tickets
   - Prioritizes by urgency (high/medium/low)
   - Links tickets to specific customers

3. **Context-Aware Planning**
   - Generates specific action plans based on actual data
   - Provides detailed steps with customer names and ticket IDs
   - Adapts recommendations to severity of situation

4. **Actionable Output**
   - Executive summary with key metrics
   - Per-customer breakdown with health scores and tickets
   - Prioritized recommendations with timelines

## How to Use

### Step 1: Load the Template

1. Go to **Templates** page
2. Click **"Use Template"** on **Support Agent**
3. You'll be redirected to the Builder with the agent loaded

### Step 2: (Optional) Customize

The default configuration works great, but you can customize:

- **CRM Filters**: Change `status: 'at-risk'` to `status: 'active'` or add `tier: 'Enterprise'`
- **Ticket Filters**: Change `status: 'open'` to `priority: 'high'`
- **Max Steps**: Adjust planner's `maxSteps` from 5 to more/fewer steps

### Step 3: Save and Run

1. Click **Save** to store your configuration
2. Go to **Playground** page
3. Select your agent from the dropdown
4. Click **Run** (Sandbox mode is default)

### Step 4: View Results

The agent will generate a **markdown report** showing:

```markdown
# Support Agent Analysis

**Goal:** Analyze customer tickets and provide support recommendations

## Executive Summary
- 🔴 **1** at-risk customers identified
- 📋 **2** open/in-progress tickets
- ⚠️ **1** high-priority issues

## Critical Customers

### TechStart Inc (Pro)
- Health Score: **45/100** 🔴
- MRR: $500
- Renewal: 2024-03-20
- Active Tickets: 2

**Recent Issues:**
- 🔥 [TICK-102] Login issues on mobile app (in-progress)
- ⚠️ [TICK-101] Feature request: Dark mode (open)

## Recommended Actions

1. **Identify at-risk customers (1 found)**
   - TechStart Inc: Health 45

2. **Review critical tickets (1 high priority)**
   - TICK-102: Login issues on mobile app

3. **Correlate customer health with ticket patterns**
   - Cross-reference ticket volume with health scores

4. **Generate personalized outreach plan**
   - Prioritize customers with multiple high-priority tickets

5. **Deliver actionable recommendations**
   - Include specific actions and timelines

## Next Steps

1. Reach out to TechStart Inc within 24 hours
2. Prioritize high-priority tickets for immediate resolution
3. Schedule health check calls with customers below 50 health score
4. Monitor ticket resolution progress daily
```

## Current Sandbox Data

### Customers in CRM
- **Acme Corp** (Enterprise, $5K MRR, Health: 85) - Active ✅
- **TechStart Inc** (Pro, $500 MRR, Health: 45) - At Risk 🔴
- **Global Systems** (Enterprise, $8K MRR, Health: 92) - Active ✅

### Support Tickets
- **TICK-101**: Feature request from TechStart Inc (Medium priority, Open)
- **TICK-102**: Login issues from TechStart Inc (High priority, In Progress)
- **TICK-103**: API limits from Acme Corp (Low priority, Resolved)

## Key Features

### 1. **Context-Aware Planning**
The planner node analyzes available data and creates specific, actionable steps:
- Mentions actual customer names
- References specific ticket IDs
- Provides relevant metrics in each step

### 2. **Intelligent Output**
The output node generates markdown with:
- Executive summary with emojis for visual clarity
- Per-customer breakdowns with all relevant details
- Prioritized recommendations
- Clear next steps

### 3. **Data Correlation**
The agent automatically:
- Links tickets to customers
- Prioritizes by health score + ticket severity
- Considers MRR and renewal dates

## Execution Flow

```
1. Goal Node
   ↓
   Sets goal: "Analyze customer tickets and provide support recommendations"
   
2. CRM Tool Node
   ↓
   Fetches: 1 at-risk customer (TechStart Inc)
   
3. Ticket Tool Node
   ↓
   Fetches: 2 open/in-progress tickets
   
4. Planner Node
   ↓
   Generates: 5 context-aware action steps with customer/ticket details
   
5. Output Node
   ↓
   Creates: Professional markdown report with insights and recommendations
```

## Extending the Agent

### Add More Customers/Tickets
Edit `lib/sandbox-data.ts` to add more realistic scenarios:

```typescript
// Add to sandboxCRMData
{
  id: 'CUST-004',
  name: 'StartupXYZ',
  tier: 'Starter',
  mrr: 99,
  status: 'at-risk',
  healthScore: 35,
  renewalDate: '2024-02-15',
  contactEmail: 'ceo@startupxyz.com',
}

// Add to sandboxTicketData
{
  id: 'TICK-104',
  customerId: 'CUST-004',
  subject: 'Billing discrepancy',
  status: 'open',
  priority: 'high',
  created: '2024-01-20T11:00:00Z',
  description: 'Charged twice for January subscription.',
}
```

### Add Policy Guardrails
Insert a Policy node between CRM and Ticket nodes:

```typescript
{
  id: 'policy-1',
  type: 'policy',
  data: {
    label: 'Data Privacy Check',
    type: 'policy',
    rules: [
      {
        id: 'r1',
        condition: 'no_sensitive_data',
        action: 'deny',
        message: 'Cannot expose sensitive customer data',
      },
    ],
  },
}
```

### Add Human Approval
Insert before Output node for manual review:

```typescript
{
  id: 'human-1',
  type: 'humanApproval',
  data: {
    label: 'Review Before Send',
    type: 'humanApproval',
    prompt: 'Approve sending this report to support team?',
    requireApproval: true,
  },
}
```

## BYOK Mode (Bring Your Own Key)

To use with real OpenAI API:

1. Go to Playground
2. Switch to **BYOK** mode
3. Enter your OpenAI API key
4. The Prompt node will use real GPT-4 for synthesis

**Note:** Currently only Prompt nodes use the LLM in BYOK mode. Other nodes use deterministic logic.

## Troubleshooting

### "No customers found"
- Check CRM filters in Tool node
- Default filter is `status: 'at-risk'`
- Try changing to `status: 'active'` to see all customers

### "Output is just raw JSON"
- Make sure Output node format is set to `markdown`
- Check that both CRM and Ticket tools ran successfully
- View the trace to see what data was collected

### "Plan is too generic"
- Ensure CRM and Ticket nodes execute **before** Planner
- Check edges are connected: Goal → CRM → Tickets → Planner → Output
- View trace to confirm data is in context

## Next Steps

1. ✅ **Support Agent is operational** - Run it now!
2. 🔄 **Try modifying filters** - See different customer scenarios
3. 🎨 **Customize the output** - Edit the markdown template
4. 🚀 **Build your own agent** - Use this as a reference

## Questions?

Check out:
- `AGENT.md` - Complete agent architecture guide
- `README.md` - Project overview
- `MANIFESTO.md` - Our philosophy on agentic AI

