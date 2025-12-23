# Agent Studio - Complete Project Structure

## 📁 File Tree

```
AgentStudio/
├── app/
│   ├── api/
│   │   └── run/
│   │       └── route.ts              # Agent execution API endpoint
│   ├── builder/
│   │   └── page.tsx                  # Visual agent builder (React Flow)
│   ├── playground/
│   │   └── page.tsx                  # Agent execution interface
│   ├── runs/
│   │   └── page.tsx                  # Run history and trace viewer
│   ├── templates/
│   │   └── page.tsx                  # Pre-built agent templates
│   ├── globals.css                   # Global styles and Tailwind
│   ├── layout.tsx                    # Root layout with header
│   └── page.tsx                      # Landing page
│
├── components/
│   ├── builder/
│   │   ├── CustomNode.tsx            # React Flow custom node component
│   │   ├── NodePalette.tsx           # Draggable node palette
│   │   └── PropertyInspector.tsx     # Node property editor
│   ├── ui/
│   │   ├── Button.tsx                # Button component
│   │   ├── Card.tsx                  # Card components
│   │   ├── Input.tsx                 # Input component
│   │   ├── Label.tsx                 # Label component
│   │   └── Textarea.tsx              # Textarea component
│   └── Header.tsx                    # Navigation header
│
├── data/
│   └── templates.ts                  # Pre-built agent templates
│
├── lib/
│   ├── executor.ts                   # Graph execution engine
│   ├── node-handlers.ts              # Node execution logic
│   ├── openai-provider.ts            # OpenAI API integration (BYOK)
│   ├── rate-limiter.ts               # In-memory rate limiting
│   ├── sandbox-data.ts               # Simulated tool data
│   ├── storage.ts                    # localStorage wrapper
│   └── utils.ts                      # Utility functions
│
├── types/
│   └── index.ts                      # TypeScript type definitions
│
├── .cursorrules                      # Cursor AI rules
├── .gitignore                        # Git ignore rules
├── DEPLOYMENT.md                     # Deployment guide
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies
├── postcss.config.js                 # PostCSS configuration
├── README.md                         # Main documentation
├── STRUCTURE.md                      # This file
├── tailwind.config.ts                # Tailwind configuration
└── tsconfig.json                     # TypeScript configuration
```

## 🎯 Core Components

### Pages (App Router)

#### `/` - Landing Page
- Modern hero section
- "What You Can Build" showcase
- "How It Works" flow
- Safety & Trust features
- Book tie-in section
- Professional footer

#### `/templates` - Agent Templates
- Browse 3 pre-built templates:
  - Support Agent (CRM + Tickets)
  - Research Agent (Web Search)
  - Workflow Agent (Multi-step with approvals)
- One-click template loading
- Category filtering

#### `/builder` - Visual Builder
- React Flow canvas
- Left sidebar: Node palette (8 node types)
- Right sidebar: Property inspector
- Toolbar: New, Save, Export, Run
- Drag-and-drop node creation
- Visual edge connections
- Real-time property editing

#### `/playground` - Execution Interface
- Agent selection dropdown
- Mode toggle: Sandbox / BYOK
- API key input (BYOK mode)
- Model selection
- Run button with loading state
- Error handling
- Auto-navigate to results

#### `/runs` - Run History
- Split view: List + Detail
- Run list with status badges
- Detailed trace viewer
- Step-by-step execution log
- Final output display
- Error highlighting
- Clear history option

### API Routes

#### `POST /api/run`
- Accepts: Graph, mode, apiKey (optional), model (optional)
- Rate limiting: 5 req/min per session
- Executes agent graph
- Returns: Complete run with trace
- Error handling with proper status codes

## 🧩 Node Types

### 1. Goal Node
**Purpose**: Define agent objective
- **Config**: Goal text
- **Execution**: Sets goal in context
- **Output**: Goal string

### 2. Prompt Node
**Purpose**: LLM prompt with variables
- **Config**: Template, variables list
- **Execution**: Variable substitution
- **Output**: Prompt response (simulated or real)

### 3. Planner Node
**Purpose**: Heuristic planning
- **Config**: Max steps, strategy (sequential/parallel/adaptive)
- **Execution**: Generates step plan
- **Output**: Plan object with steps

### 4. Memory Node
**Purpose**: In-run state management
- **Config**: Key, operation (read/write/append)
- **Execution**: Memory operations
- **Output**: Memory value

### 5. Tool Node
**Purpose**: Execute tools
- **Config**: Tool type, parameters
- **Tools**:
  - SimWebSearch: Canned search results
  - SimCRM: Fake customer data
  - SimTicket: Fake support tickets
- **Output**: Tool results

### 6. Policy Node
**Purpose**: Governance rules
- **Config**: Rules array (condition, action, message)
- **Conditions**: max_output_length, no_sensitive_data
- **Actions**: allow, deny, warn
- **Output**: Policy check result

### 7. Human Approval Node
**Purpose**: Manual approval gate
- **Config**: Prompt, require approval flag
- **Execution**: Auto-approved in sandbox
- **Output**: Approval status

### 8. Output Node
**Purpose**: Format final output
- **Config**: Format (text/json/markdown)
- **Execution**: Formats accumulated data
- **Output**: Formatted result

## 🔧 Core Libraries

### executor.ts - Execution Engine
- Graph validation
- Topological sort for execution order
- Context management
- Guardrails enforcement:
  - Max 12 steps
  - Max 5000 char output
  - Loop detection
  - Policy violations
- Trace generation
- Error handling

### node-handlers.ts - Node Execution
- Per-node execution functions
- Context manipulation
- Variable resolution
- Tool simulation
- Policy evaluation
- Output formatting

### storage.ts - Persistence Layer
- localStorage wrapper
- Graph CRUD operations
- Run history management
- 50-run limit
- JSON serialization

### rate-limiter.ts - Protection
- In-memory rate tracking
- 5 requests per minute
- Per-session limits
- Automatic cleanup

### sandbox-data.ts - Simulated Tools
- Web search results (3 categories)
- CRM customer data (3 records)
- Support tickets (3 tickets)
- Query functions with filtering

### openai-provider.ts - BYOK Integration
- OpenAI API wrapper
- Message formatting
- Usage tracking
- Error handling
- Zero persistence

## 📊 Data Flow

### Agent Creation Flow
```
Templates → Builder → Storage
     ↓
  User edits nodes/edges
     ↓
  Save to localStorage
```

### Agent Execution Flow
```
Playground → API Route → Executor
     ↓            ↓           ↓
  Select      Validate   Topological Sort
     ↓            ↓           ↓
  Config    Rate Limit   Execute Nodes
     ↓            ↓           ↓
   Run       Execute    Apply Guardrails
     ↓            ↓           ↓
  Runs ←── Save Run ← Generate Trace
```

### Trace Generation
```
For each node:
1. Record input state
2. Execute node logic
3. Check guardrails
4. Record output
5. Update context
6. Add to trace
```

## 🎨 UI Components

### Base Components (shadcn/ui style)
- Button: 5 variants, 3 sizes
- Card: Header, content, footer
- Input: Standard text input
- Label: Form labels
- Textarea: Multi-line input

### Custom Components
- Header: Navigation with active state
- NodePalette: Draggable node library
- PropertyInspector: Dynamic form based on node type
- CustomNode: React Flow node visualization
- StatusBadge: Run status indicator
- TraceViewer: Step-by-step execution display

## 🔐 Security Architecture

### API Key Handling
1. User enters key in playground
2. Stored in React state only
3. Sent to API route per request
4. Used once for OpenAI call
5. Never logged or persisted
6. Cleared on page refresh

### Rate Limiting
- Session-based tracking
- 5 requests per 60 seconds
- In-memory Map storage
- Automatic cleanup
- 429 status on limit

### Guardrails
- Step counter (max 12)
- Output size limit (5000 chars)
- Loop detection via state hash
- Policy engine
- Abort on violation

### Input Validation
- Graph structure validation
- Node type checking
- Parameter validation
- JSON parsing safety
- Error boundaries

## 📦 Dependencies

### Production
- next: ^14.1.0
- react: ^18.2.0
- react-dom: ^18.2.0
- reactflow: ^11.10.4
- lucide-react: ^0.309.0
- clsx: ^2.1.0
- tailwind-merge: ^2.2.0

### Development
- typescript: ^5.3.3
- @types/node: ^20.11.0
- @types/react: ^18.2.48
- @types/react-dom: ^18.2.18
- tailwindcss: ^3.4.1
- autoprefixer: ^10.4.17
- postcss: ^8.4.33

## 🚀 Build & Deploy

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Vercel Deploy
```bash
git push origin main
# Auto-deploys via GitHub integration
```

## 📈 Performance

- Landing page: Static (CDN)
- Templates page: Static (CDN)
- Builder: Client-side only
- Playground: Client + API route
- Runs: Client-side only
- API execution: <10s (guardrails)

## 🧪 Testing Strategy

### Manual Testing Flow
1. Browse landing page
2. Load template
3. Edit in builder
4. Save agent
5. Run in sandbox
6. View trace
7. Test BYOK mode
8. Export JSON
9. Clear history

### Edge Cases Handled
- Empty graphs
- Cycles in graph
- Missing nodes
- Invalid configurations
- API failures
- Rate limits
- Large outputs
- Infinite loops

## 📝 Type System

All types in `/types/index.ts`:
- NodeType (8 variants)
- AgentNodeData (discriminated union)
- AgentGraph (nodes + edges + metadata)
- ExecutionContext (runtime state)
- TraceEntry (execution log)
- AgentRun (complete execution record)
- RunRequest/Response (API contract)
- AgentTemplate (pre-built agents)

## 🎓 Educational Value

This codebase demonstrates:
- Agent orchestration patterns
- Graph execution engines
- Guardrail implementation
- Sandbox vs. production modes
- Visual programming UIs
- Trace-based debugging
- Policy-driven governance
- BYOK architecture
- Rate limiting strategies
- localStorage patterns

---

**Status**: ✅ Production-ready MVP
**Lines of Code**: ~3,500+
**Components**: 25+
**Node Types**: 8
**Templates**: 3
**API Routes**: 1

