import { CheckCircle2, ClipboardList, Lightbulb, Route } from 'lucide-react';
import type { CityCandidate } from '../data/cities';
import { getBeginnerVerdict, getCityRole, getOpeningPlan, getSimpleReason } from '../utils/cityNarrative';

interface DecisionStoryCardProps {
  city: CityCandidate;
}

export default function DecisionStoryCard({ city }: DecisionStoryCardProps) {
  const reasons = getSimpleReason(city);
  const plan = getOpeningPlan(city);

  return (
    <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
      <h2 className="flex items-center gap-2 text-xl font-bold text-white">
        <Lightbulb className="h-5 w-5 text-amber-300" />
        如果我是玩家，会怎么判断？
      </h2>

      <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-xl border border-green-400/30 bg-green-500/10 p-5">
          <div className="text-sm text-slate-400">一句话结论</div>
          <div className="mt-2 text-2xl font-bold leading-8 text-green-200">{getBeginnerVerdict(city)}</div>
          <div className="mt-4 rounded-lg border border-cyan-400/20 bg-slate-950 px-3 py-2 text-sm text-cyan-100">{getCityRole(city)}</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-gray-900 p-4">
            <h3 className="flex items-center gap-2 font-bold text-white">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              老师可以这样理解
            </h3>
            <div className="mt-3 grid gap-2">
              {(reasons.length > 0 ? reasons : ['这座城没有明显万能优势，更依赖后续规划。']).map((item) => (
                <div key={item} className="rounded-lg border border-green-400/15 bg-green-400/10 px-3 py-2 text-sm text-green-50">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-gray-900 p-4">
            <h3 className="flex items-center gap-2 font-bold text-white">
              <ClipboardList className="h-5 w-5 text-cyan-300" />
              前期行动顺序
            </h3>
            <ol className="mt-3 grid gap-2">
              {plan.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-lg border border-cyan-400/15 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-50">
                  <span className="font-bold text-cyan-200">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-50">
        <Route className="h-5 w-5 shrink-0 text-amber-300" />
        直观类比：开城位置就像现实里选城市新区，既要看水、电、交通和资源，也要考虑安全、发展空间和未来产业布局。
      </div>
    </section>
  );
}
