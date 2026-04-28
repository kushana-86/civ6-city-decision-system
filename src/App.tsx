import { BarChart3, BookOpen, GitCompare, Home, MessageSquare, Network, Route, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import ComparePage from './pages/ComparePage';
import DetailPage from './pages/DetailPage';
import HomePage from './pages/HomePage';
import IndicatorPage from './pages/IndicatorPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import KnowledgeQaPage from './pages/KnowledgeQaPage';
import ScorePage from './pages/ScorePage';
import SearchPage from './pages/SearchPage';
import StrategyPage from './pages/StrategyPage';

type Page = 'home' | 'search' | 'detail' | 'score' | 'compare' | 'indicators' | 'strategy' | 'graph' | 'qa';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [activeCityId, setActiveCityId] = useState('river-hill-plains');

  const openCity = (id: string) => {
    setActiveCityId(id);
    setPage('detail');
  };

  const openScore = (id: string) => {
    setActiveCityId(id);
    setPage('score');
  };

  return (
    <div className="min-h-screen text-slate-100">
      <header className="sticky top-0 z-20 border-b border-cyan-500/20 bg-slate-950/85 shadow-lg backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button type="button" onClick={() => setPage('home')} className="flex items-center gap-3 text-left transition-all hover:scale-105">
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-400/10 p-2 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.25)]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white md:text-base">Civ VI 城市舒适度分析系统</div>
              <div className="hidden text-xs text-slate-500 sm:block">Retrieval → Analysis → Decision</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <NavButton active={page === 'home'} onClick={() => setPage('home')} icon={<Home className="h-4 w-4" />} label="首页" />
            <NavButton active={page === 'search' || page === 'detail' || page === 'score'} onClick={() => setPage('search')} icon={<Search className="h-4 w-4" />} label="检索" />
            <NavButton active={page === 'strategy'} onClick={() => setPage('strategy')} icon={<Route className="h-4 w-4" />} label="策略" />
            <NavButton active={page === 'graph'} onClick={() => setPage('graph')} icon={<Network className="h-4 w-4" />} label="图谱" />
            <NavButton active={page === 'qa'} onClick={() => setPage('qa')} icon={<MessageSquare className="h-4 w-4" />} label="问答" />
            <NavButton active={page === 'compare'} onClick={() => setPage('compare')} icon={<GitCompare className="h-4 w-4" />} label="对比" />
            <NavButton active={page === 'indicators'} onClick={() => setPage('indicators')} icon={<BookOpen className="h-4 w-4" />} label="指标" />
          </div>
        </nav>
      </header>

      {page === 'home' && <HomePage onNavigate={(next) => setPage(next as Page)} />}
      {page === 'search' && <SearchPage onOpenCity={openCity} onOpenScore={openScore} />}
      {page === 'detail' && <DetailPage cityId={activeCityId} onBack={() => setPage('search')} />}
      {page === 'score' && <ScorePage cityId={activeCityId} />}
      {page === 'strategy' && <StrategyPage />}
      {page === 'graph' && <KnowledgeGraphPage />}
      {page === 'qa' && <KnowledgeQaPage />}
      {page === 'compare' && <ComparePage />}
      {page === 'indicators' && <IndicatorPage onBack={() => setPage('home')} />}
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all hover:scale-105 ${
        active
          ? 'border-cyan-400/40 bg-cyan-300/15 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.18)]'
          : 'border-transparent text-slate-400 hover:border-cyan-500/20 hover:bg-slate-900 hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
