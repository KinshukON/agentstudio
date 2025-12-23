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
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Build agents by doing —<br />not by reading diagrams
          </h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {appName} is a visual playground to design, run, and understand agentic AI systems safely.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/builder">
              <Button size="lg" className="w-full sm:w-auto">
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/book">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Get the Book
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What You Can Build */}
      <section className="bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            What You Can Build
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Support Agent</CardTitle>
                <CardDescription className="text-sm">
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
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Research Agent</CardTitle>
                <CardDescription className="text-sm">
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
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Network className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Workflow Agent</CardTitle>
                <CardDescription className="text-sm">
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                1
              </div>
              <h3 className="text-base font-semibold mb-1.5">Design</h3>
              <p className="text-muted-foreground text-xs">
                Drag and drop nodes to build your agent visually
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                2
              </div>
              <h3 className="text-base font-semibold mb-1.5">Run</h3>
              <p className="text-muted-foreground text-xs">
                Execute in sandbox or with your own API key
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                3
              </div>
              <h3 className="text-base font-semibold mb-1.5">Trace</h3>
              <p className="text-muted-foreground text-xs">
                Inspect step-by-step execution and debug
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                4
              </div>
              <h3 className="text-base font-semibold mb-1.5">Export</h3>
              <p className="text-muted-foreground text-xs">
                Download your agent as JSON for production
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Safety & Trust
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Sandbox-First</h3>
                <p className="text-xs text-muted-foreground">
                  All agents run in a safe sandbox by default with simulated tools. No real-world actions.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Built-in Guardrails</h3>
                <p className="text-xs text-muted-foreground">
                  Automatic step limits, output size checks, and loop detection protect against runaway agents.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">BYOK - Never Stored</h3>
                <p className="text-xs text-muted-foreground">
                  Your OpenAI API keys are used per-request only and never logged or persisted.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Rate Limited</h3>
                <p className="text-xs text-muted-foreground">
                  Free tier includes smart rate limiting to prevent abuse and ensure fair usage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Tie-In */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Want the Full Enterprise Blueprint?
            </h2>
            <p className="text-base text-muted-foreground mb-6">
              {appName} teaches you the fundamentals. The companion book goes deeper:
            </p>
            <ul className="text-left max-w-lg mx-auto mb-6 space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Play className="h-2.5 w-2.5 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm">Advanced orchestration patterns and multi-agent coordination</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Play className="h-2.5 w-2.5 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm">Enterprise governance frameworks and compliance strategies</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Play className="h-2.5 w-2.5 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm">Production operating models and team structures</span>
              </li>
            </ul>
            <Link href="/book">
              <Button size="lg" variant="outline">
                Learn More About the Book
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-xs text-muted-foreground">
              © 2024 {appName}. Built for learning agentic AI systems.
            </div>
            <div className="flex gap-4">
              <Link href="/templates" className="text-xs text-muted-foreground hover:text-foreground">
                Templates
              </Link>
              <Link href="/builder" className="text-xs text-muted-foreground hover:text-foreground">
                Builder
              </Link>
              <Link href="/playground" className="text-xs text-muted-foreground hover:text-foreground">
                Playground
              </Link>
              <Link href="/runs" className="text-xs text-muted-foreground hover:text-foreground">
                Runs
              </Link>
              <a href={bookUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground">
                Book
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

