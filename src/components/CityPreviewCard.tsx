import { Droplets, Gauge, Hammer, Leaf, Smile } from 'lucide-react';
import type { CityCandidate } from '../data/cities';
import { getCityIllustration } from '../utils/cityIllustrations';
import { calculateCityScore } from '../utils/calculateCityScore';
import { getBeginnerVerdict, getCityRole, getSimpleReason } from '../utils/cityNarrative';
import ResourceIconList from './ResourceIconList';
import StatItem from './StatItem';

interface CityPreviewCardProps {
  city: CityCandidate;
  onOpen: (id: string) => void;
}

export default function CityPreviewCard({ city, onOpen }: CityPreviewCardProps) {
  const score = calculateCityScore(city);
  const illustration = getCityIllustration(city);
  const simpleReasons = getSimpleReason(city);

  return (
    <button
      type="button"
      onClick={() => onOpen(city.id)}
      className="w-full rounded-xl border border-cyan-500/20 bg-slate-900/90 p-5 text-left shadow-lg shadow-cyan-950/30 transition-all hover:scale-[1.02] hover:border-cyan-400/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-300">Selected Plot</div>
          <h2 className="mt-2 text-2xl font-bold text-white">{city.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{city.description}</p>
          <div className="mt-3 rounded-lg border border-green-400/25 bg-green-400/10 px-3 py-2 text-sm font-semibold text-green-100">
            {getBeginnerVerdict(city)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">推荐指数</div>
          <div className="text-5xl font-bold text-green-400">{score.total}</div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950">
        <img src={illustration.src} alt={`${city.name}插图`} className="h-40 w-full object-cover transition-all hover:scale-105" />
        <div className="border-t border-cyan-500/20 px-3 py-2 text-xs text-cyan-100">{illustration.label}</div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-700 bg-gray-900 p-4">
        <div className="text-sm font-bold text-white">直观定位：{getCityRole(city)}</div>
        <div className="mt-3 grid gap-2">
          {(simpleReasons.length > 0 ? simpleReasons : ['这块地没有明显万能优势，需要看具体路线。']).map((reason) => (
            <div key={reason} className="rounded-lg border border-cyan-400/15 bg-cyan-400/10 px-3 py-2 text-xs leading-5 text-cyan-50">
              {reason}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <StatItem icon={Leaf} label="粮食" value={city.food} tone="green" />
        <StatItem icon={Hammer} label="产能" value={city.production} tone="gold" />
        <StatItem icon={Droplets} label="水源" value={city.waterSource} tone="blue" />
        <StatItem icon={Smile} label="宜居度" value={city.amenityPotential} suffix="/10" tone="cyan" />
      </div>

      <div className="mt-5 grid gap-3">
        <ResourceIconList title="奢侈资源" resources={city.luxuryResources} />
        <ResourceIconList title="战略资源" resources={city.strategicResources} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {city.tags.map((tag) => (
          <span key={tag} className="tag-chip">{tag}</span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-700 pt-4 text-sm">
        <span className="text-slate-400">评级：<b className="text-cyan-100">{score.rating}</b></span>
        <span className="inline-flex items-center gap-2 text-cyan-200">
          <Gauge className="h-4 w-4" />
          进入详情分析
        </span>
      </div>
    </button>
  );
}
