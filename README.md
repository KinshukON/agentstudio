# Agent Studio

**Agent Studio** is an open-source visual playground to design, run (sandbox or BYOK), trace, and export AI agents — built to help people learn *agentic AI by building real systems*.

This is not a chatbot builder or a prompt toy.  
Agent Studio focuses on **orchestration, guardrails, human-in-the-loop design, and traceability** — the things that matter when agents move from demos to real workflows.

---

## ✨ What You Can Do

- 🧩 **Design agents visually** using a drag-and-drop graph editor
- ▶️ **Run agents safely** in sandbox mode with simulated tools
- 🔑 **Bring Your Own Key (BYOK)** to run agents with OpenAI (keys are never stored)
- 🔍 **Inspect full execution traces** step-by-step
- 📦 **Export agent specs** as JSON for reuse or extension
- 🧠 **Learn agent patterns** through pre-built templates

---

## 🧠 Agent Templates

Agent Studio ships with three canonical agent archetypes:

- **Support Agent**  
  Data aggregation → planning → action synthesis

- **Research Agent**  
  Memory initialization → search → synthesis

- **Workflow Agent**  
  Policy checks → planning → human approval → execution

Each template demonstrates real-world agentic design patterns and best practices.

---

## 🧪 Execution Modes

### Sandbox Mode (Default)
- No external API calls
- Simulated tools and datasets
- Safe for experimentation and learning

### BYOK Mode
- Use your own OpenAI API key
- Keys are kept in-memory only
- No storage, no logging, no persistence

---

## 🔒 Safety & Guardrails

Agent Studio is designed with safety in mind:

- Step limits and loop protection
- Policy-based tool allowlists
- Human approval nodes for gated actions
- Full traceability of every execution step

---

## 🚀 Getting Started (Local)

```bash
git clone https://github.com/KinshukON/agentstudio.git
cd agentstudio
npm install
npm run dev
```

Then open:  
👉 **http://localhost:3002**

---

## 🌍 Deployment

Agent Studio is optimized for **Vercel (Free Tier)**.

```bash
npm run build
```

Deploy directly from GitHub — no custom server required.

---

## 🤝 Contributing

Agent Studio is open-source and community-friendly.

- Fork the repo
- Create a feature branch
- Submit a pull request
- All PRs require review before merging to main

**Please read [MANIFESTO.md](./MANIFESTO.md) to understand the design philosophy before contributing.**

---

## 📘 Why This Exists

Agent Studio is the hands-on companion to the book  
**AI Agents at Work** — bridging theory with practice.

The book explains *why* agentic systems matter.  
Agent Studio lets you *build* them.

---

## 📄 License

Apache License 2.0

---

## 📚 Additional Documentation

- [MANIFESTO.md](./MANIFESTO.md) - Design philosophy and principles
- [AGENT.md](./AGENT.md) - Deep dive into agent architecture
- [QUICKSTART.md](./QUICKSTART.md) - Get started in 5 minutes
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide
- [KAGGLE_INTEGRATION.md](./KAGGLE_INTEGRATION.md) - Kaggle integration roadmap
- [STRUCTURE.md](./STRUCTURE.md) - Technical architecture details

---

**Build agents responsibly.**  
**Build agents visibly.**  
**Build agents that can be trusted.**
