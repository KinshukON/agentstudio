# Kaggle Integration Guide

## Overview

Agent Studio can be extended to integrate with Kaggle for real-world data analysis, model training, and dataset management. This guide shows how to leverage Kaggle's ecosystem with Agent Studio agents.

## Why Kaggle + Agent Studio?

### Complementary Strengths

**Agent Studio Provides**:
- Visual agent orchestration
- Execution traces and debugging
- Safe sandbox testing
- Governance and guardrails

**Kaggle Provides**:
- 50,000+ public datasets
- GPU/TPU compute resources
- Pre-trained models
- Jupyter notebook environment
- Community and competitions

### Combined Use Cases

1. **Data-Driven Agents**: Replace sandbox data with real Kaggle datasets
2. **ML Model Integration**: Call Kaggle-hosted models from agents
3. **Automated Workflows**: Trigger Kaggle notebooks from agents
4. **Competition Automation**: Build agents that participate in competitions
5. **Research Pipelines**: Orchestrate data → train → evaluate workflows

---

## Getting Started

### Prerequisites

1. **Kaggle Account**: Sign up at [kaggle.com](https://kaggle.com)
2. **API Credentials**: Get from Kaggle → Settings → API → Create New Token
3. **Python Environment**: For local Kaggle API usage

### Install Kaggle API

```bash
# In your local environment (not in Agent Studio yet)
pip install kaggle

# Place credentials
mkdir -p ~/.kaggle
mv ~/Downloads/kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json
```

---

## Integration Patterns

### Pattern 1: Dataset Integration

#### Use Case
Replace sandbox CRM data with real customer churn dataset from Kaggle.

#### Implementation

**Step 1**: Create Kaggle Dataset Tool Node

```typescript
// Add to lib/sandbox-data.ts
export async function fetchKaggleDataset(datasetSlug: string, file: string) {
  // This would use Kaggle API
  const response = await fetch(`/api/kaggle/dataset/${datasetSlug}/${file}`);
  return await response.json();
}
```

**Step 2**: Add API Route

```typescript
// app/api/kaggle/dataset/[...slug]/route.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: Request, { params }) {
  const [owner, dataset, file] = params.slug;
  
  // Download dataset using kaggle CLI
  await execAsync(`kaggle datasets download -d ${owner}/${dataset} -f ${file} -p /tmp`);
  
  // Read and return data
  const data = await fs.readFile(`/tmp/${file}`, 'utf-8');
  return Response.json(JSON.parse(data));
}
```

**Step 3**: Add KaggleDataset Tool Type

```typescript
// types/index.ts
export type ToolType =
  | 'SimWebSearch'
  | 'SimCRM'
  | 'SimTicket'
  | 'KaggleDataset';  // New!

// Add interface
export interface KaggleDatasetParams {
  dataset: string;  // e.g., "username/dataset-name"
  file: string;     // e.g., "data.csv"
  filters?: Record<string, any>;
}
```

**Step 4**: Update Node Handler

```typescript
// lib/node-handlers.ts
case 'KaggleDataset':
  const { dataset, file, filters } = params;
  const kaggleData = await fetchKaggleDataset(dataset, file);
  
  // Apply filters if provided
  let filteredData = kaggleData;
  if (filters) {
    filteredData = kaggleData.filter(row => {
      return Object.entries(filters).every(([key, value]) => 
        row[key] === value
      );
    });
  }
  
  context.variables['kaggleData'] = filteredData;
  return {
    output: filteredData,
    summary: `Kaggle dataset loaded: ${filteredData.length} rows`,
  };
```

**Example Agent**:
```
Goal("Analyze customer churn")
  ↓
Tool(KaggleDataset, {
  dataset: "blastchar/telco-customer-churn",
  file: "WA_Fn-UseC_-Telco-Customer-Churn.csv",
  filters: { Churn: "Yes" }
})
  ↓
Planner(analyze patterns)
  ↓
Output(markdown)
```

---

### Pattern 2: Notebook Execution

#### Use Case
Trigger a Kaggle notebook to run analysis, wait for results.

#### Implementation

**Step 1**: Create Kaggle Notebook Tool

```typescript
// lib/kaggle-notebook.ts
export async function executeKaggleNotebook(
  notebook: string,
  inputs: Record<string, any>,
  waitForCompletion: boolean = true
) {
  // Uses Kaggle API's kernels push
  const response = await fetch('/api/kaggle/notebook/execute', {
    method: 'POST',
    body: JSON.stringify({ notebook, inputs, waitForCompletion })
  });
  
  return await response.json();
}
```

**Step 2**: API Route

```typescript
// app/api/kaggle/notebook/execute/route.ts
export async function POST(request: Request) {
  const { notebook, inputs, waitForCompletion } = await request.json();
  
  // Create kernel session
  const kernel = await kaggleAPI.kernels.push({
    slug: notebook,
    kernelType: 'notebook',
    language: 'python',
    enableGpu: false,
    enableInternet: true,
    datasetSources: [],
    competitionSources: [],
    newTitle: `Agent Execution - ${Date.now()}`
  });
  
  if (waitForCompletion) {
    // Poll for completion
    const result = await pollKernelStatus(kernel.ref);
    return Response.json(result);
  }
  
  return Response.json({ kernelRef: kernel.ref, status: 'running' });
}
```

**Example Agent**:
```
Goal("Train churn prediction model")
  ↓
Tool(KaggleDataset, "get training data")
  ↓
Memory(write, "train_data")
  ↓
Tool(KaggleNotebook, {
  notebook: "username/churn-model-trainer",
  inputs: { dataset: "train_data" },
  waitForCompletion: true
})
  ↓
Output(model metrics)
```

---

### Pattern 3: Model Inference

#### Use Case
Call a pre-trained model hosted on Kaggle for predictions.

#### Implementation

**Step 1**: Create Model Inference Tool

```typescript
// lib/kaggle-model.ts
export async function kaggleModelInfer(
  modelSlug: string,
  input: any
) {
  const response = await fetch('/api/kaggle/model/infer', {
    method: 'POST',
    body: JSON.stringify({ modelSlug, input })
  });
  
  return await response.json();
}
```

**Example Agent**:
```
Goal("Predict customer churn")
  ↓
Tool(KaggleDataset, "get customer data")
  ↓
Tool(KaggleModel, {
  model: "username/churn-predictor",
  input: variables.customerData
})
  ↓
Policy("check prediction confidence")
  ↓
Output(predictions)
```

---

### Pattern 4: Competition Automation

#### Use Case
Submit predictions to Kaggle competitions automatically.

#### Implementation

```typescript
// Tool: KaggleCompetition
{
  "toolType": "KaggleCompetition",
  "parameters": {
    "competition": "competition-name",
    "operation": "submit",
    "file": "predictions.csv",
    "message": "Agent submission v1"
  }
}
```

**Example Agent**:
```
Goal("Generate competition submission")
  ↓
Tool(KaggleDataset, "download competition data")
  ↓
Tool(KaggleNotebook, "run model")
  ↓
Memory(write, "predictions")
  ↓
Tool(KaggleCompetition, "submit predictions")
  ↓
Output(submission status)
```

---

## Real-World Examples

### Example 1: Customer Churn Analysis

**Dataset**: [Telco Customer Churn](https://www.kaggle.com/datasets/blastchar/telco-customer-churn)

**Agent Flow**:
```json
{
  "name": "Kaggle Churn Analyzer",
  "nodes": [
    {
      "type": "goal",
      "data": {
        "goal": "Analyze churn patterns in Kaggle dataset"
      }
    },
    {
      "type": "tool",
      "data": {
        "toolType": "KaggleDataset",
        "parameters": {
          "dataset": "blastchar/telco-customer-churn",
          "file": "WA_Fn-UseC_-Telco-Customer-Churn.csv"
        }
      }
    },
    {
      "type": "planner",
      "data": {
        "maxSteps": 5,
        "strategy": "sequential"
      }
    },
    {
      "type": "output",
      "data": {
        "format": "markdown"
      }
    }
  ]
}
```

### Example 2: Titanic Competition

**Competition**: [Titanic - Machine Learning from Disaster](https://www.kaggle.com/c/titanic)

**Agent Flow**:
```
Goal("Submit Titanic predictions")
  ↓
Tool(KaggleCompetition, {
  operation: "download",
  competition: "titanic"
})
  ↓
Tool(KaggleNotebook, {
  notebook: "my-titanic-model",
  waitForCompletion: true
})
  ↓
Tool(KaggleCompetition, {
  operation: "submit",
  file: "predictions.csv"
})
  ↓
Output("Submission complete")
```

### Example 3: Daily Data Pipeline

**Use Case**: Daily analysis of updated datasets

**Agent Flow**:
```
Goal("Run daily analysis")
  ↓
Tool(KaggleDataset, {
  dataset: "mydata/daily-metrics",
  file: "latest.csv"
})
  ↓
Memory(write, "raw_data")
  ↓
Tool(KaggleNotebook, {
  notebook: "data-processor",
  inputs: { data: "raw_data" }
})
  ↓
Memory(write, "processed_data")
  ↓
Tool(KaggleDataset, {
  operation: "upload",
  dataset: "mydata/processed-metrics",
  file: "processed.csv"
})
  ↓
Output("Pipeline complete")
```

---

## Implementation Checklist

### Phase 1: Basic Integration
- [ ] Add Kaggle API credentials to .env
- [ ] Create /api/kaggle routes
- [ ] Add KaggleDataset tool type
- [ ] Test with public dataset
- [ ] Update node handlers
- [ ] Add to PropertyInspector

### Phase 2: Notebook Integration
- [ ] Implement notebook execution
- [ ] Add polling for completion
- [ ] Handle kernel outputs
- [ ] Test with simple notebook
- [ ] Add error handling

### Phase 3: Advanced Features
- [ ] Model inference support
- [ ] Competition submission
- [ ] Dataset upload
- [ ] Metadata management
- [ ] Caching layer

---

## Security Considerations

### API Key Management
```typescript
// NEVER do this:
const KAGGLE_KEY = "hardcoded-key";  // ❌

// Instead:
const KAGGLE_KEY = process.env.KAGGLE_API_KEY;  // ✅
```

### Rate Limiting
Kaggle API has limits:
- **Datasets**: 100 requests/hour
- **Notebooks**: 50 executions/day
- **Submissions**: 5/day per competition

Add rate limiting to Kaggle tools.

### Data Privacy
- Don't expose private datasets
- Validate user permissions
- Sanitize outputs
- Follow Kaggle terms of service

---

## Cost Considerations

### Free Tier (Kaggle)
- ✅ 30 hours/week GPU
- ✅ Unlimited public datasets
- ✅ 20GB storage
- ✅ Free notebook execution

### Vercel Free Tier Limits
- ⚠️ 10-second function timeout
- ⚠️ 100k invocations/month
- ⚠️ 100GB bandwidth

**Recommendation**: Use Kaggle for heavy compute, Agent Studio for orchestration.

---

## Testing Strategy

### Local Testing
```bash
# Test Kaggle API
kaggle datasets list

# Test dataset download
kaggle datasets download -d blastchar/telco-customer-churn

# Test notebook
kaggle kernels pull username/notebook-name
```

### Integration Testing
1. Create test agent with KaggleDataset tool
2. Run in sandbox (mock Kaggle response)
3. Run with real API (small dataset)
4. Verify trace shows correct data
5. Check error handling

---

## Community Resources

### Kaggle Datasets for Agent Testing
1. **Customer Data**: [E-commerce Data](https://www.kaggle.com/datasets/carrie1/ecommerce-data)
2. **Support Tickets**: [Customer Support Tickets](https://www.kaggle.com/datasets/suraj520/customer-support-ticket-dataset)
3. **Sales Data**: [Superstore Sales](https://www.kaggle.com/datasets/rohitsahoo/sales-forecasting)

### Example Notebooks
- [Data Processing Pipeline](https://www.kaggle.com/code/example)
- [ML Model Training](https://www.kaggle.com/code/example)
- [Prediction Generation](https://www.kaggle.com/code/example)

---

## Roadmap

### Near-term (v1.1)
- [ ] Basic dataset tool
- [ ] Read-only operations
- [ ] Public datasets only

### Mid-term (v1.2)
- [ ] Notebook execution
- [ ] Model inference
- [ ] Private datasets

### Long-term (v2.0)
- [ ] Competition automation
- [ ] Dataset uploads
- [ ] Collaborative agents
- [ ] Kaggle marketplace integration

---

## Contributing

Want to help build Kaggle integration?

1. Fork Agent Studio
2. Implement a Kaggle tool
3. Add tests and docs
4. Submit pull request
5. Share example agents!

---

## Support

- **Kaggle API Docs**: [kaggle.com/docs/api](https://www.kaggle.com/docs/api)
- **Agent Studio Issues**: GitHub Issues
- **Community Forum**: Kaggle Discussions
- **Examples**: See `/examples/kaggle/` (coming soon)

---

## License

Kaggle integration code is released under MIT License.
See LICENSE file for details.

Kaggle is a trademark of Kaggle Inc. This is an unofficial integration.

---

**Ready to combine Agent Studio + Kaggle?** Start with Pattern 1 (Dataset Integration) and build from there! 🚀

