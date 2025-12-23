'use client';

import { templates } from '@/data/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { storage } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { Brain, FileText, Network, Tag } from 'lucide-react';

const categoryIcons = {
  support: Brain,
  research: FileText,
  workflow: Network,
};

export default function TemplatesPage() {
  const router = useRouter();

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Save template graph to storage
    storage.saveGraph(template.graph);
    
    // Navigate to builder with the template
    router.push(`/builder?id=${template.graph.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Agent Templates</h1>
          <p className="text-lg text-muted-foreground">
            Start with pre-built agent templates and customize them to your needs.
            Each template demonstrates key agentic patterns and best practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const Icon = categoryIcons[template.category];
            
            return (
              <Card key={template.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                  <div className="mt-2 text-xs text-primary/70 font-medium">
                    Pattern: {template.category === 'support' ? 'Data Aggregation + Synthesis' : 
                             template.category === 'research' ? 'Sequential Research + Analysis' : 
                             'Governed Multi-Step Workflow'}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.map((tag) => (
                        <div
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-xs"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Nodes:</span>
                        <span className="font-medium">{template.graph.nodes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Edges:</span>
                        <span className="font-medium">{template.graph.edges.length}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleUseTemplate(template.id)}
                    className="w-full"
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-lg border bg-muted/50">
          <h2 className="text-xl font-semibold mb-3">Building Your Own Agent?</h2>
          <p className="text-muted-foreground mb-4">
            Start from scratch in the builder or customize one of these templates.
            All templates can be edited, exported, and reused.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/builder')}
          >
            Open Builder
          </Button>
        </div>
      </div>
    </div>
  );
}

