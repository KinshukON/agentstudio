'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AgentNodeData } from '@/types';
import { Brain, MessageSquare, Map, Database, Wrench, Shield, UserCheck, FileOutput } from 'lucide-react';

const nodeIcons = {
  goal: Brain,
  prompt: MessageSquare,
  planner: Map,
  memory: Database,
  tool: Wrench,
  policy: Shield,
  humanApproval: UserCheck,
  output: FileOutput,
};

const nodeColors = {
  goal: 'bg-blue-500',
  prompt: 'bg-green-500',
  planner: 'bg-purple-500',
  memory: 'bg-yellow-500',
  tool: 'bg-orange-500',
  policy: 'bg-red-500',
  humanApproval: 'bg-pink-500',
  output: 'bg-teal-500',
};

export const CustomNode = memo(({ data, selected }: NodeProps<AgentNodeData>) => {
  const Icon = nodeIcons[data.type];
  const colorClass = nodeColors[data.type];

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-card shadow-md min-w-[180px] ${
        selected ? 'border-primary' : 'border-border'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-6 h-6 rounded ${colorClass} flex items-center justify-center flex-shrink-0`}>
          <Icon className="h-3 w-3 text-white" />
        </div>
        <div className="font-medium text-sm">{data.label || data.type}</div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-1">
        {data.type}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

