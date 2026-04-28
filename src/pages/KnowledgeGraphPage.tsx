import { BrainCircuit, CircleDot, Database, GitBranch, Info, Network, Search, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { buildKnowledgeGraph, type KnowledgeEdge, type KnowledgeNode, type KnowledgeNodeType } from '../utils/knowledgeGraph';

const nodeTone: Record<KnowledgeNodeType, { fill: string; stroke: string; text: string; label: string }> = {
  concept: { fill: '#f59e0b', stroke: '#fde68a', text: '#fff7ed', label: '概念' },
  city: { fill: '#22c55e', stroke: '#bbf7d0', text: '#f0fdf4', label: '城市' },
  terrain: { fill: '#38bdf8', stroke: '#bae6fd', text: '#f0f9ff', label: '地形/标签' },
  resource: { fill: '#a78bfa', stroke: '#ddd6fe', text: '#faf5ff', label: '资源' },
  district: { fill: '#06b6d4', stroke: '#a5f3fc', text: '#ecfeff', label: '区域' },
  strategy: { fill: '#f97316', stroke: '#fed7aa', text: '#fff7ed', label: '策略' },
  risk: { fill: '#ef4444', stroke: '#fecaca', text: '#fef2f2', label: '风险' },
};

const relationLabel: Record<string, string> = {
  has_tag: '具备特征',
  has_resource: '拥有资源',
  fits_district: '适合区域',
  supports_strategy: '支持策略',
  has_risk: '存在风险',
  explains: '解释/支撑',
};

const nodeTypes = Object.keys(nodeTone) as KnowledgeNodeType[];

type ViewMode = 'focus' | 'overview';

export default function KnowledgeGraphPage() {
  const graph = useMemo(() => buildKnowledgeGraph(11), []);
  const [selectedId, setSelectedId] = useState('concept:settlement');
  const [activeTypes, setActiveTypes] = useState<KnowledgeNodeType[]>(nodeTypes);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('focus');

  const selectedNode = graph.nodes.find((node) => node.id === selectedId) ?? graph.nodes[0];
  const selectedEdgeIds = new Set(graph.edges.filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id).map((edge) => edge.id));
  const connectedNodeIds = new Set(
    graph.edges
      .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
      .flatMap((edge) => [edge.source, edge.target]),
  );

  const focusEdgeIds = new Set(
    graph.edges
      .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id || edge.source === 'concept:settlement')
      .slice(0, 22)
      .map((edge) => edge.id),
  );
  const focusNodeIds = new Set(['concept:settlement', selectedNode.id]);
  graph.edges.forEach((edge) => {
    if (!focusEdgeIds.has(edge.id)) return;
    focusNodeIds.add(edge.source);
    focusNodeIds.add(edge.target);
  });

  const visibleNodes = graph.nodes.filter((node) => {
    const matchesType = activeTypes.includes(node.type);
    const matchesQuery = !query.trim() || node.label.includes(query.trim()) || node.description.includes(query.trim());
    const matchesMode = viewMode === 'overview' || focusNodeIds.has(node.id);
    return matchesType && matchesQuery && matchesMode;
  });
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = graph.edges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target) && (viewMode === 'overview' || focusEdgeIds.has(edge.id)));

  const relationRows = graph.edges
    .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
    .map((edge) => ({
      edge,
      other: graph.nodes.find((node) => node.id === (edge.source === selectedNode.id ? edge.target : edge.source)),
    }))
    .filter((item): item is { edge: KnowledgeEdge; other: KnowledgeNode } => Boolean(item.other));

  const toggleType = (type: KnowledgeNodeType) => {
    setActiveTypes((current) => (current.includes(type) ? current.filter((item) => item !== type) : [...current, type]));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-cyan-300">Knowledge Graph</div>
            <h1 className="mt-2 text-4xl font-bold text-white">文明六开城知识图谱</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              将候选城市、地形标签、资源、区域、策略路线和风险补救组织成节点与关系，展示系统如何从数据检索走向可解释决策。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Metric value={graph.nodes.length} label="节点" />
            <Metric value={graph.edges.length} label="关系" />
            <Metric value="7" label="类型" />
          </div>
        </div>
      </header>

      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <Network className="h-5 w-5 text-cyan-300" />
                {viewMode === 'focus' ? '聚焦关系网络' : '全局关系网络'}
              </h2>
              <p className="mt-2 text-sm text-slate-400">默认只展示核心节点和当前节点的一跳关系，点击节点逐步展开理解路径。</p>
            </div>
            <label className="relative block lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索城市、资源、策略..."
                className="w-full rounded-lg border border-slate-700 bg-gray-900 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-400"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {nodeTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTypes.includes(type) ? 'border-cyan-300 bg-cyan-300/15 text-cyan-50' : 'border-slate-700 bg-slate-950 text-slate-500'
                  }`}
                >
                  {nodeTone[type].label}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setViewMode('focus')}
                className={`rounded-md px-3 py-1.5 text-xs font-bold ${viewMode === 'focus' ? 'bg-cyan-300 text-slate-950' : 'text-slate-400'}`}
              >
                聚焦模式
              </button>
              <button
                type="button"
                onClick={() => setViewMode('overview')}
                className={`rounded-md px-3 py-1.5 text-xs font-bold ${viewMode === 'overview' ? 'bg-cyan-300 text-slate-950' : 'text-slate-400'}`}
              >
                全局模式
              </button>
            </div>
          </div>

          <GraphCanvas
            nodes={visibleNodes}
            edges={visibleEdges}
            selectedId={selectedNode.id}
            selectedEdgeIds={selectedEdgeIds}
            connectedNodeIds={connectedNodeIds}
            onSelect={setSelectedId}
          />
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border p-3" style={{ borderColor: nodeTone[selectedNode.type].stroke, backgroundColor: `${nodeTone[selectedNode.type].fill}33` }}>
                <CircleDot className="h-6 w-6" style={{ color: nodeTone[selectedNode.type].stroke }} />
              </div>
              <div>
                <div className="text-xs text-slate-500">{nodeTone[selectedNode.type].label}</div>
                <h2 className="text-2xl font-bold text-white">{selectedNode.label}</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{selectedNode.description}</p>
            {selectedNode.score !== undefined && (
              <div className="mt-4 rounded-xl border border-green-400/30 bg-green-400/10 p-4 text-center">
                <div className="text-xs text-slate-400">综合评分</div>
                <div className="text-4xl font-bold text-green-300">{selectedNode.score}</div>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
            <h3 className="flex items-center gap-2 font-bold text-white">
              <GitBranch className="h-5 w-5 text-cyan-300" />
              关联关系
            </h3>
            <div className="mt-4 grid gap-3">
              {relationRows.slice(0, 10).map(({ edge, other }) => (
                <button
                  key={edge.id}
                  type="button"
                  onClick={() => setSelectedId(other.id)}
                  className="rounded-xl border border-slate-700 bg-gray-900 p-3 text-left transition-all hover:scale-[1.02] hover:border-cyan-400/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-white">{other.label}</span>
                    <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-100">{relationLabel[edge.type]}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{edge.label}</div>
                </button>
              ))}
              {relationRows.length === 0 && <div className="rounded-xl border border-slate-700 bg-gray-900 p-4 text-sm text-slate-500">暂无关联关系</div>}
            </div>
          </section>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <ExplainCard icon={Database} title="实体层" text="城市、资源、区域、策略都变成图谱实体，便于统一描述和检索。" />
        <ExplainCard icon={Share2} title="关系层" text="拥有资源、适合区域、支持策略、存在风险等边，解释为什么系统这样推荐。" />
        <ExplainCard icon={BrainCircuit} title="推理层" text="通过关系聚合，可以回答“哪个城市适合科技胜利”“哪些资源改善舒适度”等问题。" />
      </section>
    </main>
  );
}

function GraphCanvas({
  nodes,
  edges,
  selectedId,
  selectedEdgeIds,
  connectedNodeIds,
  onSelect,
}: {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  selectedId: string;
  selectedEdgeIds: Set<string>;
  connectedNodeIds: Set<string>;
  onSelect: (id: string) => void;
}) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
      <svg viewBox="0 0 1000 620" className="h-[520px] w-full">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L8,4 L0,8 Z" fill="#64748b" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const source = nodeMap.get(edge.source);
          const target = nodeMap.get(edge.target);
          if (!source || !target) return null;
          const active = selectedEdgeIds.has(edge.id);
          return (
            <g key={edge.id}>
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={active ? '#67e8f9' : '#475569'}
                strokeWidth={active ? 2.8 : 1.2}
                opacity={active ? 0.95 : 0.22}
                markerEnd="url(#arrow)"
              />
              {active && (
                <text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 6} textAnchor="middle" className="fill-cyan-100 text-[13px] font-semibold">
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
        {nodes.map((node) => {
          const tone = nodeTone[node.type];
          const active = node.id === selectedId;
          const connected = connectedNodeIds.has(node.id);
          const opacity = active || connected ? 1 : 0.48;
          return (
            <g key={node.id} role="button" tabIndex={0} onClick={() => onSelect(node.id)} className="cursor-pointer">
              {(active || connected) && (
                <circle cx={node.x} cy={node.y} r={node.radius + 7} fill="none" stroke={active ? '#ffffff' : '#67e8f9'} strokeWidth={active ? 2 : 1} opacity={active ? 0.45 : 0.2} />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius}
                fill={tone.fill}
                stroke={active ? '#ffffff' : tone.stroke}
                strokeWidth={active ? 4 : 2}
                opacity={opacity}
                className="transition-all"
              />
              {(active || connected || node.type === 'concept') && (
                <text x={node.x} y={node.y + node.radius + 16} textAnchor="middle" className="fill-slate-100 text-[13px] font-bold">
                  {node.label}
                </text>
              )}
              {node.score !== undefined && (
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-slate-950 text-[15px] font-black">
                  {node.score}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-cyan-500/20 bg-gray-900 p-4 text-center">
      <div className="text-3xl font-bold text-green-300">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}

function ExplainCard({ icon: Icon, title, text }: { icon: typeof Info; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
      <Icon className="h-6 w-6 text-cyan-300" />
      <h2 className="mt-4 text-lg font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}
