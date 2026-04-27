import { BarChart3, BookOpen, GitCompare, Map, Search, Target } from 'lucide-react';
import { cities } from '../data/cities';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const modules = [
  { icon: Search, title: '信息检索工作台', text: '从关键词、筛选条件和排序方式出发，生成可解释的开城检索结果。', page: 'search' },
  { icon: Target, title: '评分分析入口', text: '先进入检索结果，再点击具体建城点查看评分仪表盘。', page: 'search' },
  { icon: GitCompare, title: '位置对比', text: '自动对比优质建城点与不推荐建城点，突出决策差异。', page: 'compare' },
  { icon: BookOpen, title: '指标说明', text: '说明信息采集、信息组织、信息检索、信息评价与开城决策的关系。', page: 'indicators' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900 p-8 shadow-lg shadow-cyan-950/30">
          <div className="text-xs uppercase tracking-[0.32em] text-cyan-300">Civilization VI Retrieval System</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
            城市舒适度信息检索与开城决策支持系统
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            将候选开城地点转化为可查询、可筛选、可排序、可解释的数据对象，形成“检索 → 结果 → 分析 → 决策”的完整流程。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('search')}
              className="rounded-lg bg-cyan-300 px-5 py-3 font-bold text-slate-950 shadow-lg transition-all hover:scale-105 hover:bg-cyan-200"
            >
              进入信息检索
            </button>
            <button
              type="button"
              onClick={() => onNavigate('compare')}
              className="rounded-lg border border-cyan-500/30 bg-slate-950 px-5 py-3 font-bold text-cyan-100 transition-all hover:scale-105 hover:border-cyan-300/60"
            >
              查看对比分析
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg shadow-cyan-950/30">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <BarChart3 className="h-5 w-5 text-cyan-300" />
            检索系统概览
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {[
              [String(cities.length), '候选地块'],
              ['6', '筛选条件'],
              ['4', '排序方式'],
              ['100', '评分满分'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-cyan-500/20 bg-gray-900 p-5 transition-all hover:scale-105">
                <div className="text-4xl font-bold text-green-400">{value}</div>
                <div className="mt-2 text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-slate-700 bg-gray-900 p-5">
            <div className="flex items-center gap-2 text-cyan-100">
              <Map className="h-5 w-5" />
              用户体验流程
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">查询 → 筛选 → 排序 → 结果 → 点击 → 分析 → 决策</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              type="button"
              key={module.title}
              onClick={() => onNavigate(module.page)}
              className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 text-left shadow-lg shadow-cyan-950/30 transition-all hover:scale-105 hover:border-cyan-400/50"
            >
              <Icon className="h-7 w-7 text-cyan-300" />
              <h2 className="mt-4 text-lg font-bold text-white">{module.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{module.text}</p>
            </button>
          );
        })}
      </section>
    </main>
  );
}
