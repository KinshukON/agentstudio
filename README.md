# Agent Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

**Build agents by doing — not by reading diagrams.**

Agent Studio is a production-quality visual playground to design, run, and understand agentic AI systems safely. This is not a demo—it's a serious, educational platform for learning how to build AI agents.

> 📖 **New**: Check out [AGENT.md](AGENT.md) for comprehensive agent architecture documentation and [KAGGLE_INTEGRATION.md](KAGGLE_INTEGRATION.md) for integrating with Kaggle datasets and notebooks!

## 🎯 Features

- **Visual Agent Builder**: Drag-and-drop interface powered by React Flow
- **8 Node Types**: Goal, Prompt, Planner, Memory, Tool, Policy, Human Approval, Output
- **Sandbox Mode**: Safe execution with simulated tools (Web Search, CRM, Tickets)
- **BYOK Support**: Bring Your Own OpenAI API Key (never stored)
- **Execution Traces**: Step-by-step inspection of agent runs
- **Built-in Guardrails**: Step limits, loop detection, output size checks
- **Export Agents**: Download agent specifications as JSON
- **Templates**: Pre-built agents for Support, Research, and Workflow

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- (Optional) OpenAI API key for BYOK mode

### Local Development

1. **Clone and install dependencies**

```bash
cd AgentStudio
npm install
```

2. **Set up environment variables**

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_APP_NAME=Agent Studio
NEXT_PUBLIC_AUTHOR_NAME=Your Name
NEXT_PUBLIC_BOOK_URL=https://your-book-url.com
```

3. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📦 Deployment to Vercel

This application is optimized for Vercel Free Tier with zero configuration.

### Deploy via GitHub

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/agent-studio.git
git push -u origin main
```

2. **Deploy on Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Add environment variables:
  - `NEXT_PUBLIC_APP_NAME`
  - `NEXT_PUBLIC_AUTHOR_NAME`
  - `NEXT_PUBLIC_BOOK_URL`
- Click "Deploy"

Your app will be live in minutes!

### Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy.

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components built on shadcn/ui patterns
- **Drag & Drop**: React Flow
- **State**: localStorage + React state (no database required)
- **Deployment**: Vercel (serverless functions)

### Project Structure

```
/app
  /page.tsx                 # Landing page
  /templates/page.tsx       # Agent templates
  /builder/page.tsx         # Visual builder
  /playground/page.tsx      # Agent execution
  /runs/page.tsx            # Run history & traces
  /api/run/route.ts         # Execution API
  /layout.tsx               # Root layout
  /globals.css              # Global styles

/components
  /ui/                      # Reusable UI components
  /builder/                 # Builder-specific components
  Header.tsx                # Navigation header

/lib
  executor.ts               # Execution engine with guardrails
  node-handlers.ts          # Node execution logic
  openai-provider.ts        # OpenAI API integration (BYOK)
  rate-limiter.ts           # In-memory rate limiting
  sandbox-data.ts           # Simulated tool data
  storage.ts                # localStorage wrapper
  utils.ts                  # Utility functions

/data
  templates.ts              # Pre-built agent templates

/types
  index.ts                  # TypeScript type definitions
```

## 🔒 Security & Privacy

### API Key Handling

- **Never Stored**: OpenAI API keys are kept only in React state during a session
- **Never Logged**: Keys are not written to any logs or analytics
- **Per-Request Only**: Keys are passed to the API route for a single execution and immediately discarded
- **Client-Side Only in localStorage**: Only agent definitions and run history are stored locally

### Rate Limiting

- **5 requests per minute per session** to prevent abuse on free tier
- In-memory rate limiter (resets on server restart)
- Can be configured in `lib/rate-limiter.ts`

### Guardrails

All agents run with built-in safety measures:

- **Max Steps**: Default 12 steps to prevent infinite loops
- **Output Size Limit**: 5000 characters max
- **Repeated State Detection**: Catches infinite loops
- **Policy Checks**: Configurable rules (e.g., no sensitive data)

## 🧩 Node Types

| Node Type | Description |
|-----------|-------------|
| **Goal** | Define the agent's objective |
| **Prompt** | Template prompts with variable substitution |
| **Planner** | Heuristic planning (sequential, parallel, adaptive) |
| **Memory** | Read, write, or append to in-run memory |
| **Tool** | Sandbox tools: SimWebSearch, SimCRM, SimTicket |
| **Policy** | Governance rules and guardrails |
| **Human Approval** | Manual approval gates (auto-approved in sandbox) |
| **Output** | Format final output (text, JSON, markdown) |

## 🎨 Customization

### Adding New Node Types

1. Define type in `types/index.ts`
2. Add handler in `lib/node-handlers.ts`
3. Add UI in `components/builder/PropertyInspector.tsx`
4. Add to palette in `components/builder/NodePalette.tsx`

### Adding New Sandbox Tools

1. Add data/logic in `lib/sandbox-data.ts`
2. Add tool case in `executeToolNode()` in `lib/node-handlers.ts`
3. Add to `ToolType` in `types/index.ts`

## 📚 Learning Resources

This platform teaches agent fundamentals through hands-on building. For deeper learning:

- **Templates**: Start with pre-built agents in `/templates`
- **Builder**: Experiment with node connections
- **Traces**: Study execution step-by-step in `/runs`
- **Export**: Download and analyze agent JSON specs
- **Agent Architecture**: Read [AGENT.md](AGENT.md) for deep dive into node types and patterns
- **Kaggle Integration**: See [KAGGLE_INTEGRATION.md](KAGGLE_INTEGRATION.md) for real dataset integration

## 🐛 Troubleshooting

### "Module not found" errors

```bash
npm install
```

### React Flow not rendering

Check that `reactflow` CSS is imported in the builder page:

```typescript
import 'reactflow/dist/style.css';
```

### Rate limit errors

Wait 60 seconds or restart the dev server to reset the in-memory rate limiter.

### API key not working (BYOK)

- Verify key starts with `sk-`
- Check OpenAI account has credits
- Try in sandbox mode first to verify agent logic

## 🤝 Contributing

This is an educational MVP. Feel free to fork and customize for your needs!

## 📄 License

MIT License - use freely for learning and teaching agentic AI concepts.

Copyright (c) 2024 Agent Studio

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. See [LICENSE](LICENSE) file for full details.

## 🙏 Acknowledgments

Built to demonstrate production-quality agent orchestration patterns for educational purposes.

---

**Ready to build agents?** Start at [http://localhost:3000](http://localhost:3000)

