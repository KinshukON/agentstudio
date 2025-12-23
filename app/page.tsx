import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowRight, Shield, Play, FileText, Zap, Network, Brain } from 'lucide-react';

export default function HomePage() {
  const bookUrl = process.env.NEXT_PUBLIC_BOOK_URL || '#';
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Agent Studio';

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-6">
            Build agents by doing —<br />not by reading diagrams
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            {appName} is a visual playground to design, run, and understand agentic AI systems safely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/builder">
              <Button size="lg" className="w-full sm:w-auto">
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href={bookUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Get the Book
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* What You Can Build */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You Can Build
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Support Agent</CardTitle>
                <CardDescription>
                  Automate customer support by analyzing tickets, CRM data, and generating action plans.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/templates">
                  <Button variant="ghost" className="w-full">
                    Explore Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Research Agent</CardTitle>
                <CardDescription>
                  Conduct web research, synthesize findings, and generate comprehensive reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/templates">
                  <Button variant="ghost" className="w-full">
                    Explore Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Workflow Agent</CardTitle>
                <CardDescription>
                  Orchestrate complex workflows with approval gates, policy checks, and governance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/templates">
                  <Button variant="ghost" className="w-full">
                    Explore Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Design</h3>
              <p className="text-muted-foreground text-sm">
                Drag and drop nodes to build your agent visually
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Run</h3>
              <p className="text-muted-foreground text-sm">
                Execute in sandbox or with your own API key
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Trace</h3>
              <p className="text-muted-foreground text-sm">
                Inspect step-by-step execution and debug
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Export</h3>
              <p className="text-muted-foreground text-sm">
                Download your agent as JSON for production
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Safety & Trust
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sandbox-First</h3>
                <p className="text-sm text-muted-foreground">
                  All agents run in a safe sandbox by default with simulated tools. No real-world actions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Built-in Guardrails</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic step limits, output size checks, and loop detection protect against runaway agents.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">BYOK - Never Stored</h3>
                <p className="text-sm text-muted-foreground">
                  Your OpenAI API keys are used per-request only and never logged or persisted.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Rate Limited</h3>
                <p className="text-sm text-muted-foreground">
                  Free tier includes smart rate limiting to prevent abuse and ensure fair usage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Tie-In */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Want the Full Enterprise Blueprint?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {appName} teaches you the fundamentals. The companion book goes deeper:
            </p>
            <ul className="text-left max-w-xl mx-auto mb-8 space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Play className="h-3 w-3 text-primary" />
                </div>
                <span className="text-muted-foreground">Advanced orchestration patterns and multi-agent coordination</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Play className="h-3 w-3 text-primary" />
                </div>
                <span className="text-muted-foreground">Enterprise governance frameworks and compliance strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Play className="h-3 w-3 text-primary" />
                </div>
                <span className="text-muted-foreground">Production operating models and team structures</span>
              </li>
            </ul>
            <a href={bookUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                Learn More About the Book
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 {appName}. Built for learning agentic AI systems.
            </div>
            <div className="flex gap-6">
              <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground">
                Templates
              </Link>
              <Link href="/builder" className="text-sm text-muted-foreground hover:text-foreground">
                Builder
              </Link>
              <Link href="/playground" className="text-sm text-muted-foreground hover:text-foreground">
                Playground
              </Link>
              <Link href="/runs" className="text-sm text-muted-foreground hover:text-foreground">
                Runs
              </Link>
              <a href={bookUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                Book
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

