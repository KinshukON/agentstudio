'use client';

import { NodeType } from '@/types';
import { Brain, MessageSquare, Map, Database, Wrench, Shield, UserCheck, FileOutput } from 'lucide-react';

const nodeTypes: Array<{ type: NodeType; label: string; icon: any; color: string }> = [
  { type: 'goal', label: 'Goal', icon: Brain, color: 'bg-blue-500' },
  { type: 'prompt', label: 'Prompt', icon: MessageSquare, color: 'bg-green-500' },
  { type: 'planner', label: 'Planner', icon: Map, color: 'bg-purple-500' },
  { type: 'memory', label: 'Memory', icon: Database, color: 'bg-yellow-500' },
  { type: 'tool', label: 'Tool', icon: Wrench, color: 'bg-orange-500' },
  { type: 'policy', label: 'Policy', icon: Shield, color: 'bg-red-500' },
  { type: 'humanApproval', label: 'Human', icon: UserCheck, color: 'bg-pink-500' },
  { type: 'output', label: 'Output', icon: FileOutput, color: 'bg-teal-500' },
];

export function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r bg-muted/30 p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Node Palette</h3>
      <div className="space-y-2">
        {nodeTypes.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-md cursor-move transition-shadow"
            >
              <div className={`w-8 h-8 rounded ${node.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">{node.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-900 dark:text-blue-100">
          <strong>Tip:</strong> Drag nodes onto the canvas and connect them to build your agent flow.
        </p>
      </div>
    </div>
  );
}

