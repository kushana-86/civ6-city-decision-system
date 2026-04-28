import { BarChart3, CheckCircle2, Filter, Gauge, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import BeginnerGuidePanel from '../components/BeginnerGuidePanel';
import Civ6VisualGallery from '../components/Civ6VisualGallery';
import CityMapMock from '../components/CityMapMock';
import CityPreviewCard from '../components/CityPreviewCard';
import type { CityCandidate } from '../data/cities';
import { cities } from '../data/cities';
import { getCityIllustration } from '../utils/cityIllustrations';
import { calculateCityScore } from '../utils/calculateCityScore';
import { resourceGallery, terrainGallery } from '../utils/civ6VisualAssets';

interface SearchPageProps {
  onOpenCity: (id: string) => void;
  onOpenScore: (id: string) => void;
}

type Level = '全部' | '低' | '中' | '高';
type SortMode = 'score' | 'food' | 'production' | 'balance';

interface RetrievalFilters {
  river: boolean;
  hill: boolean;
  mountain: boolean;
  foodLevel: Level;
  productionLevel: Level;
  balanced: boolean;
}

interface SearchResult {
  city: CityCandidate;
  reasons: string[];
  matchedTerms: string[];
}

const defaultFilters: RetrievalFilters = {
  river: false,
  hill: false,
  mountain: false,
  foodLevel: '全部',
  productionLevel: '全部',
  balanced: false,
};

const keywordAliases: Record<string, string[]> = {
  河流: ['河流', '大河', '淡水'],
  丘陵: ['丘陵', '草丘', '矿山'],
  高粮: ['高粮', '高粮食', '粮食'],
  高粮食: ['高粮', '高粮食', '粮食'],
  高产能: ['高产能', '工业', '矿山', '产能'],
  草丘: ['草丘', '草原', '丘陵'],
  山脉: ['山脉', '山脚', '学院'],
  学院: ['学院', '科技', '科研'],
  沿海: ['沿海', '海岸', '港口', '贸易'],
};

const levelOptions: Level[] = ['全部', '低', '中', '高'];

const getFoodLevel = (value: number): Exclude<Level, '全部'> => {
  if (value >= 8) return '高';
  if (value >= 6) return '中';
  return '低';
};

const getProductionLevel = (value: number): Exclude<Level, '全部'> => {
  if (value >= 8) return '高';
  if (value >= 6) return '中';
  return '低';
};

const isBalanced = (city: CityCandidate) => Math.abs(city.food - city.production) <= 2;

const buildSearchText = (city: CityCandidate) => [city.description, city.recommendation, ...city.tags].join(' ').toLowerCase();

const tokenizeQuery = (query: string) => query.trim().split(/\s+/).filter(Boolean);

const expandTerms = (tokens: string[]) =>
  Array.from(new Set(tokens.flatMap((token) => keywordAliases[token] ?? [token])));

const includesAny = (city: CityCandidate, candidates: string[]) => {
  const text = [
    city.name,
    city.terrain,
    city.waterSource,
    city.description,
    city.recommendation,
    ...city.tags,
  ].join(' ');
  return candidates.some((item) => text.includes(item));
};

const getFilterReasons = (city: CityCandidate, filters: RetrievalFilters) => {
  const reasons: string[] = [];
  if (filters.river && includesAny(city, ['河流', '大河', '淡水'])) reasons.push('河流');
  if (filters.hill && includesAny(city, ['丘陵', '草丘', '矿山'])) reasons.push('丘陵');
  if (filters.mountain && includesAny(city, ['山脉', '山脚'])) reasons.push('山脉');
  if (filters.foodLevel !== '全部') reasons.push(`${filters.foodLevel}粮`);
  if (filters.productionLevel !== '全部') reasons.push(`${filters.productionLevel}产能`);
  if (filters.balanced && isBalanced(city)) reasons.push('粮锤平衡');
  return reasons;
};

const matchFilters = (city: CityCandidate, filters: RetrievalFilters) => {
  if (filters.river && !includesAny(city, ['河流', '大河', '淡水'])) return false;
  if (filters.hill && !includesAny(city, ['丘陵', '草丘', '矿山'])) return false;
  if (filters.mountain && !includesAny(city, ['山脉', '山脚'])) return false;
  if (filters.foodLevel !== '全部' && getFoodLevel(city.food) !== filters.foodLevel) return false;
  if (filters.productionLevel !== '全部' && getProductionLevel(city.production) !== filters.productionLevel) return false;
  if (filters.balanced && !isBalanced(city)) return false;
  return true;
};

const sortResults = (results: SearchResult[], sortMode: SortMode) =>
  [...results].sort((a, b) => {
    if (sortMode === 'food') return b.city.food - a.city.food;
    if (sortMode === 'production') return b.city.production - a.city.production;
    if (sortMode === 'balance') return Math.abs(a.city.food - a.city.production) - Math.abs(b.city.food - b.city.production);
    return calculateCityScore(b.city).total - calculateCityScore(a.city).total;
  });

const highlightText = (text: string, terms: string[]) => {
  const activeTerms = terms.filter((term) => term && text.includes(term));
  if (activeTerms.length === 0) return text;
  const pattern = new RegExp(`(${activeTerms.map(escapeRegExp).join('|')})`, 'g');
  return text.split(pattern).map((part, index) =>
    activeTerms.includes(part) ? (
      <mark key={`${part}-${index}`} className="rounded bg-cyan-300 px-1 text-slate-950">
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default function SearchPage({ onOpenCity, onOpenScore }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<RetrievalFilters>(defaultFilters);
  const [sortMode, setSortMode] = useState<SortMode>('score');
  const [selectedId, setSelectedId] = useState(cities[0].id);

  const queryTokens = useMemo(() => tokenizeQuery(query), [query]);
  const expandedTerms = useMemo(() => expandTerms(queryTokens), [queryTokens]);

  const results = useMemo(() => {
    const matched = cities.flatMap((city): SearchResult[] => {
      const text = buildSearchText(city);
      const matchedTerms = expandedTerms.filter((term) => text.includes(term.toLowerCase()) || text.includes(term));
      const matchesQuery = queryTokens.length === 0 || matchedTerms.length > 0;
      if (!matchesQuery || !matchFilters(city, filters)) return [];

      const reasons = Array.from(new Set([...matchedTerms, ...getFilterReasons(city, filters)]));
      if (reasons.length === 0) reasons.push('符合默认检索范围');
      return [{ city, reasons, matchedTerms }];
    });
    return sortResults(matched, sortMode);
  }, [expandedTerms, filters, queryTokens.length, sortMode]);

  const selectedResult = results.find((item) => item.city.id === selectedId) ?? results[0];
  const selectedCity = selectedResult?.city ?? cities[0];
  const currentConditions = [
    query.trim() ? `关键词：${query.trim()}` : '',
    filters.river ? '河流' : '',
    filters.hill ? '丘陵' : '',
    filters.mountain ? '山脉' : '',
    filters.foodLevel !== '全部' ? `${filters.foodLevel}粮` : '',
    filters.productionLevel !== '全部' ? `${filters.productionLevel}产能` : '',
    filters.balanced ? '粮锤平衡' : '',
  ].filter(Boolean);

  const updateFilter = <K extends keyof RetrievalFilters>(key: K, value: RetrievalFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.32em] text-cyan-300">Information Retrieval Workflow</div>
          <h1 className="mt-2 text-4xl font-bold text-white">开城地点信息检索工作台</h1>
          <p className="mt-2 max-w-3xl text-slate-400">查询 → 筛选 → 排序 → 结果 → 分析，完整呈现信息检索课程中的检索与评价流程。</p>
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900 p-4 shadow-lg">
          <div className="text-sm text-slate-400">检索结果数量</div>
          <div className="text-3xl font-bold text-green-400">共找到 {results.length} 个</div>
        </div>
      </header>

      <div className="mb-6">
        <Civ6VisualGallery
          title="先看图，再检索"
          subtitle="如果不知道关键词含义，可以先看这些游戏内图片：地形影响成长和防御，资源影响舒适度、军工与贸易。"
          assets={[...terrainGallery.slice(0, 8), ...resourceGallery.slice(0, 13)]}
          compact
        />
      </div>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Search className="h-5 w-5 text-cyan-300" />
              关键词检索
            </h2>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="河流 丘陵 高粮 高产能 草丘 山脉 学院 沿海"
              className="w-full rounded-xl border border-slate-700 bg-gray-900 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-400"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {['河流', '丘陵', '高粮', '高产能', '草丘', '山脉', '学院', '沿海'].map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => setQuery(word)}
                  className="rounded-lg border border-cyan-500/20 bg-slate-950 px-3 py-1.5 text-xs text-cyan-100 transition-all hover:scale-105 hover:border-cyan-300"
                >
                  {word}
                </button>
              ))}
            </div>
          </section>

          <BeginnerGuidePanel />

          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Filter className="h-5 w-5 text-cyan-300" />
              多条件筛选
            </h2>
            <div className="space-y-3">
              <CheckFilter label="是否有河流" checked={filters.river} onChange={(checked) => updateFilter('river', checked)} />
              <CheckFilter label="是否有丘陵" checked={filters.hill} onChange={(checked) => updateFilter('hill', checked)} />
              <CheckFilter label="是否有山脉" checked={filters.mountain} onChange={(checked) => updateFilter('mountain', checked)} />
              <CheckFilter label="是否粮锤平衡" checked={filters.balanced} onChange={(checked) => updateFilter('balanced', checked)} />
            </div>
            <div className="mt-5 grid gap-4">
              <LevelSelect label="粮食等级" value={filters.foodLevel} onChange={(value) => updateFilter('foodLevel', value)} />
              <LevelSelect label="产能等级" value={filters.productionLevel} onChange={(value) => updateFilter('productionLevel', value)} />
            </div>
          </section>

          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <SlidersHorizontal className="h-5 w-5 text-cyan-300" />
              排序方式
            </h2>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="w-full rounded-xl border border-slate-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="score">按综合评分排序</option>
              <option value="food">按粮食排序</option>
              <option value="production">按生产力排序</option>
              <option value="balance">按粮锤平衡排序</option>
            </select>
          </section>

          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
            <h2 className="mb-3 text-lg font-bold text-white">检索逻辑说明</h2>
            <ul className="space-y-2 text-sm leading-6 text-slate-300">
              <li>本系统基于结构化城市数据进行检索。</li>
              <li>支持关键词匹配与条件筛选。</li>
              <li>支持多维度排序。</li>
              <li>支持结果可视化分析。</li>
            </ul>
          </section>
        </aside>

        <section className="space-y-6">
          <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="relative">
              <CityMapMock city={selectedCity} />
              <div className="absolute left-5 top-5 rounded-xl border border-cyan-500/20 bg-slate-950/85 px-4 py-3 shadow-lg backdrop-blur">
                <div className="text-xs text-slate-400">当前筛选</div>
                <div className="mt-1 max-w-xl text-sm font-semibold text-cyan-100">
                  {currentConditions.length > 0 ? currentConditions.join(' + ') : '默认展示全部候选建城点'}
                </div>
              </div>
            </div>
            <CityPreviewCard city={selectedCity} onOpen={onOpenCity} />
          </section>

          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">检索结果</h2>
                <p className="mt-1 text-sm text-slate-400">共找到 {results.length} 个符合条件的建城点</p>
              </div>
              <div className="rounded-lg border border-cyan-500/20 bg-slate-950 px-3 py-2 text-sm text-cyan-100">
                当前筛选：{currentConditions.length > 0 ? currentConditions.join(' + ') : '无'}
              </div>
            </div>

            <div className="grid gap-4">
              {results.map((result) => (
                <ResultCard
                  key={result.city.id}
                  result={result}
                  selected={selectedCity.id === result.city.id}
                  highlightTerms={expandedTerms}
                  onPreview={() => setSelectedId(result.city.id)}
                  onOpenCity={() => onOpenCity(result.city.id)}
                  onOpenScore={() => onOpenScore(result.city.id)}
                />
              ))}
              {results.length === 0 && (
                <div className="rounded-xl border border-slate-700 bg-gray-900 p-8 text-center text-slate-400">
                  没有找到符合条件的建城点，请调整关键词或筛选条件。
                </div>
              )}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function CheckFilter({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-700 bg-gray-900 px-4 py-3 text-sm text-slate-200 transition-all hover:scale-[1.02] hover:border-cyan-500/40">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-cyan-300" />
    </label>
  );
}

function LevelSelect({ label, value, onChange }: { label: string; value: Level; onChange: (value: Level) => void }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Level)}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
      >
        {levelOptions.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

function ResultCard({
  result,
  selected,
  highlightTerms,
  onPreview,
  onOpenCity,
  onOpenScore,
}: {
  result: SearchResult;
  selected: boolean;
  highlightTerms: string[];
  onPreview: () => void;
  onOpenCity: () => void;
  onOpenScore: () => void;
}) {
  const { city, reasons } = result;
  const score = calculateCityScore(city);
  const illustration = getCityIllustration(city);
  const matchTags = Array.from(new Set([...reasons, ...city.tags.slice(0, 3), score.total >= 75 ? '适合开城' : '谨慎开城']));

  return (
    <article
      onMouseEnter={onPreview}
      className={`rounded-xl border p-4 shadow-lg transition-all hover:scale-[1.01] ${
        selected ? 'border-cyan-300 bg-cyan-400/10' : 'border-cyan-500/20 bg-gray-900'
      }`}
    >
      <div className="grid gap-4 lg:grid-cols-[150px_1fr_150px]">
        <div className="overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950">
          <img src={illustration.src} alt={`${city.name}插图`} className="h-full min-h-32 w-full object-cover transition-all hover:scale-105" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold text-white">{highlightText(city.name, highlightTerms)}</h3>
            <span className="rounded-lg border border-green-400/30 bg-green-400/10 px-2 py-1 text-xs text-green-200">{score.rating}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-300">{highlightText(city.description, highlightTerms)}</p>
          <div className="mt-3 text-sm text-cyan-100">
            匹配原因：该城市满足：{reasons.join(' + ')}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {matchTags.map((tag) => (
              <span key={tag} className="tag-chip">[{tag}]</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-slate-950 p-4 text-center">
          <div className="text-sm text-slate-400">综合评分</div>
          <div className="text-5xl font-bold text-green-400">{score.total}</div>
          <div className="mt-2 text-xs text-slate-500">粮 {city.food} / 产 {city.production}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-700 pt-4">
        <button
          type="button"
          onClick={onOpenCity}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition-all hover:scale-105 hover:bg-cyan-200"
        >
          <CheckCircle2 className="h-4 w-4" />
          详情分析
        </button>
        <button
          type="button"
          onClick={onOpenScore}
          className="inline-flex items-center gap-2 rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-200 transition-all hover:scale-105 hover:border-green-300"
        >
          <BarChart3 className="h-4 w-4" />
          评分仪表盘
        </button>
        <span className="ml-auto inline-flex items-center gap-2 text-sm text-slate-400">
          <Gauge className="h-4 w-4 text-cyan-300" />
          排序后结果项
        </span>
      </div>
    </article>
  );
}
