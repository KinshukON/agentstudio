'use client';

import { AgentNodeData, NodeType, ToolType, PolicyRule } from '@/types';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface PropertyInspectorProps {
  nodeData: AgentNodeData | null;
  onUpdate: (data: Partial<AgentNodeData>) => void;
  onClose: () => void;
}

export function PropertyInspector({ nodeData, onUpdate, onClose }: PropertyInspectorProps) {
  if (!nodeData) {
    return (
      <div className="w-80 border-l bg-muted/30 p-4">
        <div className="text-center text-muted-foreground text-sm mt-8">
          Select a node to edit its properties
        </div>
      </div>
    );
  }

  const renderFields = () => {
    switch (nodeData.type) {
      case 'goal':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal">Goal</Label>
              <Textarea
                id="goal"
                value={nodeData.goal || ''}
                onChange={(e) => onUpdate({ goal: e.target.value })}
                placeholder="Describe the agent's goal..."
                rows={4}
              />
            </div>
          </div>
        );

      case 'prompt':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="template">Prompt Template</Label>
              <Textarea
                id="template"
                value={nodeData.template || ''}
                onChange={(e) => onUpdate({ template: e.target.value })}
                placeholder="Use {variable} for dynamic values..."
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="variables">Variables (comma-separated)</Label>
              <Input
                id="variables"
                value={(nodeData.variables || []).join(', ')}
                onChange={(e) => onUpdate({ variables: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
                placeholder="e.g., goal, context"
              />
            </div>
          </div>
        );

      case 'planner':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="maxSteps">Max Steps</Label>
              <Input
                id="maxSteps"
                type="number"
                value={nodeData.maxSteps || 5}
                onChange={(e) => onUpdate({ maxSteps: parseInt(e.target.value) || 5 })}
                min={1}
                max={10}
              />
            </div>
            <div>
              <Label htmlFor="strategy">Strategy</Label>
              <select
                id="strategy"
                value={nodeData.strategy || 'sequential'}
                onChange={(e) => onUpdate({ strategy: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="sequential">Sequential</option>
                <option value="parallel">Parallel</option>
                <option value="adaptive">Adaptive</option>
              </select>
            </div>
          </div>
        );

      case 'memory':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="memoryKey">Memory Key</Label>
              <Input
                id="memoryKey"
                value={nodeData.memoryKey || ''}
                onChange={(e) => onUpdate({ memoryKey: e.target.value })}
                placeholder="e.g., conversation_history"
              />
            </div>
            <div>
              <Label htmlFor="operation">Operation</Label>
              <select
                id="operation"
                value={nodeData.operation || 'read'}
                onChange={(e) => onUpdate({ operation: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="read">Read</option>
                <option value="write">Write</option>
                <option value="append">Append</option>
              </select>
            </div>
          </div>
        );

      case 'tool':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="toolType">Tool Type</Label>
              <select
                id="toolType"
                value={nodeData.toolType || 'SimWebSearch'}
                onChange={(e) => onUpdate({ toolType: e.target.value as ToolType })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="SimWebSearch">Sim Web Search</option>
                <option value="SimCRM">Sim CRM</option>
                <option value="SimTicket">Sim Ticket</option>
              </select>
            </div>
            <div>
              <Label htmlFor="parameters">Parameters (JSON)</Label>
              <Textarea
                id="parameters"
                value={JSON.stringify(nodeData.parameters || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const params = JSON.parse(e.target.value);
                    onUpdate({ parameters: params });
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                placeholder='{"query": "search term"}'
                rows={4}
                className="font-mono text-xs"
              />
            </div>
          </div>
        );

      case 'policy':
        return (
          <div className="space-y-4">
            <Label>Policy Rules</Label>
            <div className="text-xs text-muted-foreground mb-2">
              Available conditions: max_output_length, no_sensitive_data
            </div>
            {(nodeData.rules || []).map((rule, index) => (
              <div key={rule.id} className="p-3 rounded-lg border space-y-2">
                <Input
                  value={rule.condition}
                  onChange={(e) => {
                    const newRules = [...(nodeData.rules || [])];
                    newRules[index] = { ...rule, condition: e.target.value };
                    onUpdate({ rules: newRules });
                  }}
                  placeholder="Condition"
                />
                <select
                  value={rule.action}
                  onChange={(e) => {
                    const newRules = [...(nodeData.rules || [])];
                    newRules[index] = { ...rule, action: e.target.value as any };
                    onUpdate({ rules: newRules });
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="allow">Allow</option>
                  <option value="deny">Deny</option>
                  <option value="warn">Warn</option>
                </select>
                <Input
                  value={rule.message || ''}
                  onChange={(e) => {
                    const newRules = [...(nodeData.rules || [])];
                    newRules[index] = { ...rule, message: e.target.value };
                    onUpdate({ rules: newRules });
                  }}
                  placeholder="Message"
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newRule: PolicyRule = {
                  id: Date.now().toString(),
                  condition: 'max_output_length',
                  action: 'deny',
                  message: 'Policy violation',
                };
                onUpdate({ rules: [...(nodeData.rules || []), newRule] });
              }}
            >
              Add Rule
            </Button>
          </div>
        );

      case 'humanApproval':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">Approval Prompt</Label>
              <Textarea
                id="prompt"
                value={nodeData.prompt || ''}
                onChange={(e) => onUpdate({ prompt: e.target.value })}
                placeholder="What should the human approve?"
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requireApproval"
                checked={nodeData.requireApproval !== false}
                onChange={(e) => onUpdate({ requireApproval: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="requireApproval">Require Approval</Label>
            </div>
          </div>
        );

      case 'output':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="format">Output Format</Label>
              <select
                id="format"
                value={nodeData.format || 'text'}
                onChange={(e) => onUpdate({ format: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="text">Text</option>
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-80 border-l bg-muted/30 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Properties</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="label">Node Label</Label>
          <Input
            id="label"
            value={nodeData.label || ''}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Node label"
          />
        </div>

        <div className="pt-4 border-t">
          {renderFields()}
        </div>
      </div>
    </div>
  );
}

