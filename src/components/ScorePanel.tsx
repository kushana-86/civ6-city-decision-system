import { Activity, Award } from 'lucide-react';
import type { CityCandidate } from '../data/cities';
import { calculateCityScore } from '../utils/calculateCityScore';
import ScoreBar from './ScoreBar';

interface ScorePanelProps {
  city: CityCandidate;
  compact?: boolean;
}

const ratingClass = {
  优秀: 'text-green-300 border-green-400/40 bg-green-400/10',
  良好: 'text-cyan-200 border-cyan-300/40 bg-cyan-400/10',
  一般: 'text-amber-200 border-amber-300/40 bg-amber-400/10',
  不推荐: 'text-red-200 border-red-300/40 bg-red-400/10',
};

export default function ScorePanel({ city, compact = false }: ScorePanelProps) {
  const score = calculateCityScore(city);

  return (
    <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg shadow-cyan-950/30">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-cyan-100/80">
            <Activity className="h-4 w-4" />
            综合评分模型
          </div>
          <div className="mt-2 flex items-end gap-3">
            <span className="text-5xl font-bold text-green-400">{score.total}</span>
            <span className="pb-2 text-sm text-slate-400">/ 100</span>
          </div>
        </div>
        <div className={`rounded-lg border px-3 py-2 text-sm font-semibold ${ratingClass[score.rating]}`}>
          <Award className="mr-1 inline h-4 w-4" />
          {score.rating}
        </div>
      </div>

      <div className={compact ? 'space-y-3' : 'grid gap-4 md:grid-cols-2'}>
        {score.breakdown.map((item) => (
          <ScoreBar key={item.key} label={item.label} value={item.value} color="cyan" />
        ))}
      </div>
    </section>
  );
}
