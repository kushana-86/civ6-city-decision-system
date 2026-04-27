import { CheckCircle2, Droplets, Hammer, Home, Leaf, RotateCcw, Shield, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import CityMapMock from '../components/CityMapMock';
import StatItem from '../components/StatItem';
import type { CityCandidate } from '../data/cities';
import { cities } from '../data/cities';
import { calculateCityScore } from '../utils/calculateCityScore';

export default function ComparePage() {
  const ranked = useMemo(() => [...cities].sort((a, b) => calculateCityScore(b).total - calculateCityScore(a).total), []);
  const [leftId, setLeftId] = useState(ranked[0].id);
  const [rightId, setRightId] = useState(ranked[ranked.length - 1].id);

  const leftCity = cities.find((city) => city.id === leftId) ?? ranked[0];
  const rightCity = cities.find((city) => city.id === rightId) ?? ranked[ranked.length - 1];
  const leftScore = calculateCityScore(leftCity);
  const rightScore = calculateCityScore(rightCity);

  const resetToExtremes = () => {
    setLeftId(ranked[0].id);
    setRightId(ranked[ranked.length - 1].id);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.32em] text-cyan-300">Settlement Comparison</div>
          <h1 className="mt-2 text-4xl font-bold text-white">建城位置对比分析</h1>
          <p className="mt-2 max-w-3xl text-slate-400">从候选地块中手动选择两个位置，比较总评分、粮食、产能、水源、宜居度和风险描述。</p>
        </div>
        <button
          type="button"
          onClick={resetToExtremes}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-slate-950 px-4 py-3 text-sm font-bold text-cyan-100 transition-all hover:scale-105 hover:border-cyan-300"
        >
          <RotateCcw className="h-4 w-4" />
          自动选择最高/最低分
        </button>
      </header>

      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_180px_1fr]">
        <CityPicker label="左侧对比地块" value={leftId} onChange={setLeftId} tone="green" />
        <div className="flex items-center justify-center rounded-xl border border-amber-300/40 bg-slate-950 text-3xl font-bold text-amber-200 shadow-[0_0_35px_rgba(251,191,36,0.25)]">
          VS
        </div>
        <CityPicker label="右侧对比地块" value={rightId} onChange={setRightId} tone="red" />
      </section>

      <section className="relative grid gap-6 lg:grid-cols-2">
        <CompareSide city={leftCity} type={leftScore.total >= rightScore.total ? 'good' : 'bad'} />
        <CompareSide city={rightCity} type={rightScore.total >= leftScore.total ? 'good' : 'bad'} />
      </section>

      <section className="mt-6 rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
        <h2 className="text-xl font-bold text-white">差异摘要</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <DiffItem label="综合评分差" value={leftScore.total - rightScore.total} />
          <DiffItem label="粮食差" value={leftCity.food - rightCity.food} />
          <DiffItem label="产能差" value={leftCity.production - rightCity.production} />
          <DiffItem label="防御差" value={leftCity.defense - rightCity.defense} />
        </div>
      </section>
    </main>
  );
}

function CityPicker({ label, value, onChange, tone }: { label: string; value: string; onChange: (value: string) => void; tone: 'green' | 'red' }) {
  return (
    <label className={`rounded-xl border bg-slate-900 p-4 shadow-lg ${tone === 'green' ? 'border-green-500/25' : 'border-red-500/25'}`}>
      <span className="text-sm text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-gray-900 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400"
      >
        {cities.map((city) => {
          const score = calculateCityScore(city);
          return (
            <option key={city.id} value={city.id}>
              {city.name} - {score.total}分
            </option>
          );
        })}
      </select>
    </label>
  );
}

function CompareSide({ city, type }: { city: CityCandidate; type: 'good' | 'bad' }) {
  const score = calculateCityScore(city);
  const good = type === 'good';

  return (
    <section className={`rounded-xl border p-5 shadow-lg transition-all hover:scale-[1.01] ${good ? 'border-green-500/25 bg-green-950/20' : 'border-red-500/25 bg-red-950/20'}`}>
      <div className={`mb-4 flex items-center gap-3 rounded-xl border px-4 py-3 ${good ? 'border-green-400/30 bg-green-500/10 text-green-300' : 'border-red-400/30 bg-red-500/10 text-red-300'}`}>
        {good ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
        <div>
          <div className="text-2xl font-bold">{good ? '当前更优建城点' : '当前较弱建城点'}</div>
          <div className="text-sm text-slate-400">{city.name}</div>
        </div>
      </div>

      <CityMapMock city={city} compact danger={!good} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <StatItem icon={Leaf} label="粮食产出" value={city.food} tone={good ? 'green' : 'red'} />
        <StatItem icon={Hammer} label="产能产出" value={city.production} tone={good ? 'gold' : 'red'} />
        <StatItem icon={Droplets} label="水源条件" value={city.waterSource} tone={good ? 'blue' : 'red'} />
        <StatItem icon={Home} label="宜居度" value={city.amenityPotential} suffix="/10" tone={good ? 'cyan' : 'red'} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[160px_1fr]">
        <div className={`rounded-xl border p-4 text-center ${good ? 'border-green-400/30 bg-green-500/10' : 'border-red-400/30 bg-red-500/10'}`}>
          <div className="text-sm text-slate-400">推荐指数</div>
          <div className={`text-6xl font-bold ${good ? 'text-green-400' : 'text-red-400'}`}>{score.total}</div>
          <div className="font-semibold text-white">{score.rating}</div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-gray-900 p-4">
          <div className="mb-2 flex items-center gap-2 font-bold text-white">
            <Shield className="h-5 w-5 text-cyan-300" />
            综合评价
          </div>
          <p className="text-sm leading-6 text-slate-300">{good ? city.recommendation : `主要风险：${city.risks.join('；')}。`}</p>
        </div>
      </div>
    </section>
  );
}

function DiffItem({ label, value }: { label: string; value: number }) {
  const positive = value > 0;
  const neutral = value === 0;

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-gray-900 p-4 text-center">
      <div className="text-sm text-slate-400">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${neutral ? 'text-slate-200' : positive ? 'text-green-400' : 'text-red-400'}`}>
        {positive ? '+' : ''}
        {value}
      </div>
    </div>
  );
}
