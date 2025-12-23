# Agent Studio - Quick Start Guide

Get Agent Studio running in 5 minutes!

## 🚀 Installation

```bash
# You're already in the AgentStudio directory
cd AgentStudio

# Install dependencies
npm install
```

## ⚙️ Configuration

Create your environment file:

```bash
# The .env.local file already exists with defaults
# Edit if you want to customize:
# - NEXT_PUBLIC_APP_NAME
# - NEXT_PUBLIC_AUTHOR_NAME  
# - NEXT_PUBLIC_BOOK_URL
```

Default values are already set and ready to go!

## 🏃 Run Locally

```bash
# Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

## 🎯 First Steps

### 1. Explore the Landing Page
- See the hero section
- Read about features
- Understand safety measures

### 2. Load a Template
- Click **"Start Building"** or navigate to **Templates**
- Choose **"Support Agent"** template
- Click **"Use Template"**

### 3. Edit in Builder
- You're now in the visual builder
- Drag nodes from the left palette
- Click a node to edit its properties in the right panel
- Connect nodes by dragging from output (bottom) to input (top)
- Click **Save** to persist your agent

### 4. Run Your Agent
- Click **Run** in the builder toolbar
- You'll land in the **Playground**
- Ensure **Sandbox** mode is selected (default)
- Click **Run Agent**

### 5. View Results
- You'll automatically navigate to the **Runs** page
- See your execution trace step-by-step
- Review the final output
- Check for any errors or warnings

## 🏗️ Building Your First Agent

Let's create a simple research agent from scratch:

### Step 1: Create New Agent
1. Go to **Builder**
2. Click **New** (if you have an existing agent loaded)
3. Name it "My Research Agent"

### Step 2: Add Nodes
Drag these nodes onto the canvas:
1. **Goal** node
2. **Tool** node (Web Search)
3. **Output** node

### Step 3: Configure Nodes
**Goal Node:**
- Click the node
- Set goal: "Research AI agent frameworks"

**Tool Node:**
- Click the node
- Tool Type: SimWebSearch
- Parameters: `{"query": "ai agent frameworks"}`

**Output Node:**
- Format: Markdown

### Step 4: Connect Nodes
- Drag from Goal node (bottom) to Tool node (top)
- Drag from Tool node to Output node

### Step 5: Save & Run
- Click **Save**
- Click **Run**
- Watch it execute in the playground!

## 🔄 Try BYOK Mode (Optional)

If you have an OpenAI API key:

1. Go to **Playground**
2. Toggle to **BYOK** mode
3. Paste your API key (starts with `sk-`)
4. Select a model (GPT-3.5 Turbo recommended)
5. Run your agent

**Important**: Your API key is NEVER stored. It's only used for this one run.

## 📤 Export Your Agent

1. In the **Builder**, click **Export**
2. A JSON file downloads with your agent definition
3. Share it or use it as documentation

## 🐛 Troubleshooting

### Nothing happens when I click Run
- Check the browser console for errors
- Ensure you have at least one node
- Make sure nodes are connected

### "Rate limit exceeded" error
- Wait 60 seconds
- You can make 5 runs per minute in development

### Builder canvas is empty
- React Flow styles might not have loaded
- Refresh the page
- Check browser console

### Template doesn't load
- Clear browser localStorage: `localStorage.clear()`
- Refresh the page
- Try a different template

## 📚 Next Steps

- **Explore Templates**: Try all three templates to understand different patterns
- **Read the Traces**: Study how agents execute step-by-step
- **Experiment with Nodes**: Try different node combinations
- **Add Guardrails**: Use Policy nodes to add safety rules
- **Check the README**: Comprehensive documentation in README.md
- **Review Types**: See all available options in types/index.ts

## 🎓 Learning Path

1. **Week 1**: Use templates, run them, study traces
2. **Week 2**: Modify templates, add new nodes
3. **Week 3**: Build agents from scratch
4. **Week 4**: Experiment with complex workflows

## 🆘 Need Help?

- **Documentation**: See README.md for full docs
- **Deployment**: See DEPLOYMENT.md for going live
- **Architecture**: See STRUCTURE.md for technical details

## ✅ Quick Checklist

- [ ] `npm install` completed
- [ ] `npm run dev` running
- [ ] Opened http://localhost:3000
- [ ] Loaded a template
- [ ] Ran an agent in sandbox
- [ ] Viewed execution trace
- [ ] Created own agent
- [ ] Exported agent JSON

---

**You're ready to build AI agents!** 🎉

Start with templates, then build your own. Focus on understanding the traces—that's where the learning happens.

