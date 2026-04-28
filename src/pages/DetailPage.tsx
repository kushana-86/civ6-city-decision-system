import { ArrowLeft, Droplets, Gem, Hammer, Home, Leaf, MapPinned, Shield } from 'lucide-react';
import AnalysisCard from '../components/AnalysisCard';
import CityMapMock from '../components/CityMapMock';
import DecisionStoryCard from '../components/DecisionStoryCard';
import ResourceIconList from '../components/ResourceIconList';
import StatItem from '../components/StatItem';
import { cities } from '../data/cities';
import { calculateCityScore } from '../utils/calculateCityScore';

interface DetailPageProps {
  cityId: string;
  onBack: () => void;
}

export default function DetailPage({ cityId, onBack }: DetailPageProps) {
  const city = cities.find((item) => item.id === cityId) ?? cities[0];
  const score = calculateCityScore(city);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-slate-900 px-3 py-2 text-sm text-slate-200 shadow-lg transition-all hover:scale-105 hover:border-cyan-400/60"
      >
        <ArrowLeft className="h-4 w-4" />
        返回检索页
      </button>

      <header className="mb-6 rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-cyan-300">City Detail Analysis</div>
            <h1 className="mt-2 text-4xl font-bold text-white">{city.name}</h1>
            <p className="mt-3 max-w-3xl text-slate-400">{city.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">总评分</div>
            <div className="text-6xl font-bold text-green-400">{score.total}</div>
            <div className="text-cyan-100">{score.rating}</div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <CityMapMock city={city} />

        <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
            <MapPinned className="h-5 w-5 text-cyan-300" />
            基本信息
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatItem icon={Leaf} label="粮食" value={city.food} tone="green" />
            <StatItem icon={Hammer} label="产能" value={city.production} tone="gold" />
            <StatItem icon={Droplets} label="水源" value={city.waterSource} tone="blue" />
            <StatItem icon={Home} label="住房" value={city.housingPotential} suffix="/10" tone="cyan" />
            <StatItem icon={Gem} label="奢侈资源" value={city.luxuryResources.length} tone="cyan" />
            <StatItem icon={Shield} label="防御" value={city.defense} suffix="/10" tone="blue" />
          </div>
          <div className="mt-5 rounded-xl border border-slate-700 bg-gray-900 p-4 text-sm leading-6 text-slate-300">
            地形：{city.terrain}<br />
            奢侈资源：{city.luxuryResources.join('、') || '无'}<br />
            战略资源：{city.strategicResources.join('、') || '无'}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ResourceIconList title="奢侈资源图标" resources={city.luxuryResources} />
            <ResourceIconList title="战略资源图标" resources={city.strategicResources} />
          </div>
        </section>

        <AnalysisCard title="优势分析" items={city.advantages} type="advantage" />
        <AnalysisCard title="风险分析" items={city.risks} type="risk" />
      </section>

      <section className="mt-6 rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="rounded-xl border border-green-400/30 bg-green-500/10 p-5 text-center">
            <div className="text-sm text-slate-400">推荐发展方向</div>
            <div className="mt-2 text-2xl font-bold text-green-300">{city.tags.includes('沿海') ? '港口贸易城' : city.tags.includes('工业') ? '工业城' : city.tags.includes('军事') ? '军事前哨城' : city.tags.includes('学院') || city.tags.includes('科技') ? '科技城' : '综合发展城'}</div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">开城建议</h2>
            <p className="mt-3 leading-7 text-slate-300">{city.recommendation}</p>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <DecisionStoryCard city={city} />
      </div>
    </main>
  );
}
