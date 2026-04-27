import { BarChart3, Compass, Shield, Sparkles } from 'lucide-react';
import ScoreBar from '../components/ScoreBar';
import StatItem from '../components/StatItem';
import { cities } from '../data/cities';
import { calculateCityScore } from '../utils/calculateCityScore';

interface ScorePageProps {
  cityId: string;
}

export default function ScorePage({ cityId }: ScorePageProps) {
  const city = cities.find((item) => item.id === cityId) ?? cities[0];
  const score = calculateCityScore(city);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 grid gap-6 rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg lg:grid-cols-[1fr_360px]">
        <div>
          <div className="text-xs uppercase tracking-[0.32em] text-cyan-300">Score Dashboard</div>
          <h1 className="mt-2 text-4xl font-bold text-white">城市舒适度评分仪表盘</h1>
          <p className="mt-3 max-w-3xl text-slate-400">当前分析对象：{city.name}。系统将水源、粮食、产能、资源、防御和规划空间组织为可评价指标。</p>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-400">综合评分</div>
          <div className="text-6xl font-bold text-green-400">{score.total}</div>
          <div className="text-lg font-semibold text-cyan-100">评级：{score.rating}</div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Compass className="h-5 w-5 text-cyan-300" />
            多维指标雷达图
          </h2>
          <div className="mt-6 flex min-h-[360px] items-center justify-center">
            <div className="relative h-72 w-72 rounded-full border border-cyan-500/30 bg-cyan-400/5 shadow-[0_0_45px_rgba(34,211,238,0.18)]">
              <div className="absolute inset-8 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-16 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-24 rounded-full border border-cyan-500/20" />
              <div className="absolute left-1/2 top-4 h-64 w-px -translate-x-1/2 bg-cyan-500/20" />
              <div className="absolute left-4 top-1/2 h-px w-64 -translate-y-1/2 bg-cyan-500/20" />
              <div className="absolute inset-14 rounded-[38%_62%_48%_52%] border border-green-300/80 bg-green-400/20 shadow-[0_0_30px_rgba(74,222,128,0.28)]" />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <div className="text-5xl font-bold text-green-400">{score.total}%</div>
                  <div className="text-sm text-slate-400">满意度拟合</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <BarChart3 className="h-5 w-5 text-cyan-300" />
            分项指标评分
          </h2>
          <div className="mt-6 space-y-5">
            {score.breakdown.map((item, index) => (
              <ScoreBar key={item.key} label={item.label} value={item.value} color={index < 4 ? 'green' : 'cyan'} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <StatItem icon={Sparkles} label="优势领域" value={score.breakdown.sort((a, b) => b.value - a.value)[0].label} tone="green" />
        <StatItem icon={Shield} label="风险领域" value={score.breakdown.sort((a, b) => a.value - b.value)[0].label} tone="red" />
        <StatItem icon={Compass} label="建议方向" value={city.recommendation.replace('。', '')} tone="blue" />
      </section>
    </main>
  );
}
