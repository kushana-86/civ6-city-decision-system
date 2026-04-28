import { AlertTriangle, BookMarked, CheckCircle2, ClipboardList, Compass, Flag, Hammer, Route, Shield, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import Civ6VisualGallery from '../components/Civ6VisualGallery';
import DistrictIconStrip from '../components/DistrictIconStrip';
import ScoreBar from '../components/ScoreBar';
import { cities } from '../data/cities';
import { calculateCityScore } from '../utils/calculateCityScore';
import { districtSceneGallery } from '../utils/civ6VisualAssets';
import { getStrategyRisks, getTopStrategyCities, strategyProfiles, type StrategyKey } from '../utils/strategyRecommendations';

const profileByKey = Object.fromEntries(strategyProfiles.map((profile) => [profile.key, profile])) as Record<StrategyKey, (typeof strategyProfiles)[number]>;

export default function StrategyPage() {
  const [activeKey, setActiveKey] = useState<StrategyKey>('balanced');
  const profile = profileByKey[activeKey];
  const rankedCities = useMemo(() => getTopStrategyCities(cities, profile), [profile]);
  const best = rankedCities[0];
  const alternatives = rankedCities.slice(1, 5);
  const cityScore = calculateCityScore(best.city);
  const riskAdvice = getStrategyRisks(best.city, profile);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-cyan-300">Strategy Recommendation</div>
            <h1 className="mt-2 text-4xl font-bold text-white">开城策略推荐工具箱</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              根据胜利路线和城市职能重新计算候选地价值，给出推荐城市、建设顺序、区域组合和风险补救建议。
            </p>
          </div>
          <div className="rounded-xl border border-green-400/30 bg-green-500/10 p-5 text-center">
            <div className="text-sm text-slate-400">当前最佳策略匹配</div>
            <div className="mt-1 text-3xl font-bold text-green-300">{best.city.name}</div>
            <div className="mt-2 text-5xl font-bold text-white">{best.strategyScore}</div>
          </div>
        </div>
      </header>

      <section className="mb-6 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {strategyProfiles.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveKey(item.key)}
            className={`rounded-xl border p-4 text-left transition-all hover:scale-[1.02] ${
              activeKey === item.key
                ? 'border-cyan-300 bg-cyan-300/15 shadow-[0_0_22px_rgba(34,211,238,0.18)]'
                : 'border-cyan-500/20 bg-slate-900 hover:border-cyan-400/50'
            }`}
          >
            <Flag className="h-5 w-5 text-cyan-300" />
            <div className="mt-3 font-bold text-white">{item.label}</div>
            <div className="mt-1 text-xs text-slate-500">{item.cityRole}</div>
          </button>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Sparkles className="h-5 w-5 text-cyan-300" />
            路线画像
          </h2>
          <p className="mt-3 leading-7 text-slate-300">{profile.summary}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoBlock icon={Compass} label="城市定位" value={profile.cityRole} />
            <InfoBlock icon={Shield} label="综合评级" value={`${cityScore.rating} / ${cityScore.total}分`} />
          </div>

          <div className="mt-6 rounded-xl border border-slate-700 bg-gray-900 p-5">
            <h3 className="flex items-center gap-2 font-bold text-white">
              <ClipboardList className="h-5 w-5 text-green-300" />
              建设优先级
            </h3>
            <ol className="mt-4 grid gap-3">
              {profile.buildOrder.map((item, index) => (
                <li key={item} className="flex items-center gap-3 rounded-lg border border-cyan-500/15 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-300 font-bold text-slate-950">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                推荐开城点
              </h2>
              <p className="mt-2 text-sm text-slate-400">{best.city.description}</p>
            </div>
            <div className="rounded-xl border border-green-400/30 bg-green-500/10 px-5 py-3 text-center">
              <div className="text-xs text-slate-400">策略分</div>
              <div className="text-4xl font-bold text-green-300">{best.strategyScore}</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <ScoreBar label="粮食成长" value={best.city.food} color="green" />
            <ScoreBar label="生产能力" value={best.city.production} color="amber" />
            <ScoreBar label="宜居潜力" value={best.city.amenityPotential} color="cyan" />
            <ScoreBar label="区域空间" value={best.city.districtSpace} color="blue" />
            <ScoreBar label="防御安全" value={best.city.defense} color="red" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <PanelList icon={Route} title="推荐区域组合" items={profile.districts} tone="cyan" />
            <PanelList icon={Hammer} title="政策与执行重点" items={profile.policyFocus} tone="green" />
          </div>

          <div className="mt-6">
            <DistrictIconStrip title="这些区域大概长这样" districts={profile.districts} />
          </div>
        </section>
      </section>

      <div className="mt-6">
        <Civ6VisualGallery
          title="常见城市区域实景"
          subtitle="同一块地如果走不同路线，最后会发展出完全不同的城市功能。"
          assets={districtSceneGallery}
        />
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-xl border border-amber-400/25 bg-slate-900 p-6 shadow-lg">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <AlertTriangle className="h-5 w-5 text-amber-300" />
            风险与补救
          </h2>
          <div className="mt-4 grid gap-3">
            {riskAdvice.map((item) => (
              <div key={item} className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <BookMarked className="h-5 w-5 text-cyan-300" />
            备选城市池
          </h2>
          <div className="mt-4 grid gap-3">
            {alternatives.map(({ city, strategyScore }, index) => (
              <div key={city.id} className="grid gap-3 rounded-xl border border-slate-700 bg-gray-900 p-4 sm:grid-cols-[44px_1fr_82px] sm:items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-500/30 bg-slate-950 font-bold text-cyan-100">
                  {index + 2}
                </div>
                <div>
                  <div className="font-bold text-white">{city.name}</div>
                  <div className="mt-1 text-sm text-slate-400">{city.recommendation}</div>
                </div>
                <div className="rounded-lg border border-green-400/25 bg-green-400/10 px-3 py-2 text-center">
                  <div className="text-xs text-slate-400">策略分</div>
                  <div className="text-2xl font-bold text-green-300">{strategyScore}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function InfoBlock({ icon: Icon, label, value }: { icon: typeof Compass; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cyan-500/20 bg-gray-900 p-4">
      <Icon className="h-5 w-5 text-cyan-300" />
      <div className="mt-3 text-sm text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function PanelList({ icon: Icon, title, items, tone }: { icon: typeof Route; title: string; items: string[]; tone: 'cyan' | 'green' }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-gray-900 p-4">
      <h3 className="flex items-center gap-2 font-bold text-white">
        <Icon className={`h-5 w-5 ${tone === 'green' ? 'text-green-300' : 'text-cyan-300'}`} />
        {title}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={tone === 'green' ? 'rounded-lg border border-green-300/25 bg-green-300/10 px-2 py-1 text-xs text-green-100' : 'tag-chip'}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
