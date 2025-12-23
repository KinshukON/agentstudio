'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AgentGraph, AgentNode, AgentNodeData, NodeType } from '@/types';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NodePalette } from '@/components/builder/NodePalette';
import { PropertyInspector } from '@/components/builder/PropertyInspector';
import { CustomNode } from '@/components/builder/CustomNode';
import { Save, Play, Download, Plus } from 'lucide-react';

const nodeTypes = {
  goal: CustomNode,
  prompt: CustomNode,
  planner: CustomNode,
  memory: CustomNode,
  tool: CustomNode,
  policy: CustomNode,
  humanApproval: CustomNode,
  output: CustomNode,
};

const defaultNodeData: Record<NodeType, Partial<AgentNodeData>> = {
  goal: { goal: 'Describe your goal here' },
  prompt: { template: '', variables: [] },
  planner: { maxSteps: 5, strategy: 'sequential' },
  memory: { memoryKey: 'default', operation: 'read' },
  tool: { toolType: 'SimWebSearch', parameters: {} },
  policy: { rules: [] },
  humanApproval: { prompt: 'Approve?', requireApproval: true },
  output: { format: 'text' },
};

function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<AgentNodeData> | null>(null);
  const [graphName, setGraphName] = useState('Untitled Agent');
  const [graphDescription, setGraphDescription] = useState('');
  const [currentGraphId, setCurrentGraphId] = useState<string | null>(null);

  // Load graph from storage on mount
  useEffect(() => {
    const graphId = searchParams.get('id');
    if (graphId) {
      const graph = storage.getGraph(graphId);
      if (graph) {
        setNodes(graph.nodes as Node[]);
        setEdges(graph.edges as Edge[]);
        setGraphName(graph.name);
        setGraphDescription(graph.description);
        setCurrentGraphId(graph.id);
      }
    }
  }, [searchParams, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!nodeType || !reactFlowInstance) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node<AgentNodeData> = {
        id: generateId(),
        type: nodeType,
        position,
        data: {
          label: `${nodeType} node`,
          type: nodeType,
          ...defaultNodeData[nodeType],
        } as AgentNodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((_: any, node: Node<AgentNodeData>) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback(
    (updates: Partial<AgentNodeData>) => {
      if (!selectedNode) return;

      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );

      setSelectedNode((prev) =>
        prev ? { ...prev, data: { ...prev.data, ...updates } } : null
      );
    },
    [selectedNode, setNodes]
  );

  const saveGraph = useCallback(() => {
    const graphId = currentGraphId || generateId();
    const graph: AgentGraph = {
      id: graphId,
      name: graphName,
      description: graphDescription,
      nodes: nodes as AgentNode[],
      edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
      metadata: {
        created: currentGraphId ? storage.getGraph(currentGraphId)?.metadata.created || new Date().toISOString() : new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0',
      },
    };

    storage.saveGraph(graph);
    setCurrentGraphId(graphId);
    alert('Agent saved successfully!');
  }, [nodes, edges, graphName, graphDescription, currentGraphId]);

  const runAgent = useCallback(() => {
    saveGraph();
    if (currentGraphId) {
      router.push(`/playground?id=${currentGraphId}`);
    }
  }, [saveGraph, currentGraphId, router]);

  const exportGraph = useCallback(() => {
    const graph: AgentGraph = {
      id: currentGraphId || generateId(),
      name: graphName,
      description: graphDescription,
      nodes: nodes as AgentNode[],
      edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0',
      },
    };

    const dataStr = JSON.stringify(graph, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${graphName.replace(/\s+/g, '-').toLowerCase()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges, graphName, graphDescription, currentGraphId]);

  const createNew = useCallback(() => {
    if (confirm('Create a new agent? Unsaved changes will be lost.')) {
      setNodes([]);
      setEdges([]);
      setGraphName('Untitled Agent');
      setGraphDescription('');
      setCurrentGraphId(null);
      setSelectedNode(null);
    }
  }, [setNodes, setEdges]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <NodePalette />
      
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4 bg-background">
          <div className="flex items-center gap-4">
            <Input
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              className="max-w-xs"
              placeholder="Agent name"
            />
            <Input
              value={graphDescription}
              onChange={(e) => setGraphDescription(e.target.value)}
              className="max-w-md"
              placeholder="Description"
            />
            <div className="flex-1" />
            <Button variant="outline" size="sm" onClick={createNew}>
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
            <Button variant="outline" size="sm" onClick={saveGraph}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={exportGraph}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={runAgent}>
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div ref={reactFlowWrapper} className="flex-1 bg-muted/20 relative">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center text-muted-foreground/40 max-w-md">
                <p className="text-sm mb-2">✨ Start building your agent</p>
                <p className="text-xs">Most agents start with a <strong>Goal</strong> and a <strong>Policy</strong> node</p>
              </div>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <PropertyInspector
        nodeData={selectedNode?.data || null}
        onUpdate={updateNodeData}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <ReactFlowProvider>
      <BuilderContent />
    </ReactFlowProvider>
  );
}

