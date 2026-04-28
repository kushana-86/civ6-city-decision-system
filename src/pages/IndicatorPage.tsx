import { ArrowLeft, Database, FileSearch, Image, Layers3, Scale } from 'lucide-react';
import Civ6VisualGallery from '../components/Civ6VisualGallery';
import { districtGallery, resourceGallery, terrainGallery } from '../utils/civ6VisualAssets';

interface IndicatorPageProps {
  onBack: () => void;
}

const indicators = [
  ['淡水/水源条件', '决定城市初始住房和成长稳定性，河流、大河、湖泊与绿洲通常优于单纯沿海。'],
  ['初始粮食', '影响人口增长速度，人口越快增长，越早解锁区域和工作更多地块。'],
  ['初始产能', '影响纪念碑、粮仓、区域、单位和奇观的建设效率，是开局节奏核心。'],
  ['奢侈资源数量', '奢侈资源为城市提供舒适度，并可通过贸易改善整体帝国宜居性。'],
  ['战略资源潜力', '马、铁、硝石、煤、铝、铀等资源决定军事和工业阶段的上限。'],
  ['防御优势', '山脉、丘陵、河流、隘口能降低边境城市的军事风险。'],
  ['区域规划空间', '决定学院、工业区、港口、商业中心等区域能否获得高邻接并避免拥挤。'],
  ['住房潜力', '综合淡水、改良设施和可扩展地块，影响城市中后期人口上限。'],
  ['宜居度/舒适度来源', '来自奢侈资源、娱乐、政策和城市位置的综合潜力，用于判断长期稳定性。'],
];

const process = [
  { icon: Database, title: '信息采集', text: '将地形、水源、资源、产出、防御与区域空间整理为结构化字段。' },
  { icon: Layers3, title: '信息组织', text: '用标签、基础属性和分析文本描述候选城市，形成可检索的数据集合。' },
  { icon: FileSearch, title: '信息检索', text: '通过关键词和标签筛选候选地点，快速定位“河流”“沿海”“高产能”等需求。' },
  { icon: Scale, title: '信息评价', text: '使用权重评分模型对结果排序，并生成评级和开城建议。' },
];

export default function IndicatorPage({ onBack }: IndicatorPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-slate-900 px-3 py-2 text-sm text-slate-200 shadow-lg transition-all hover:scale-105 hover:border-cyan-400/60"
      >
        <ArrowLeft className="h-4 w-4" />
        返回首页
      </button>

      <section className="mb-8 rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
        <div className="text-xs uppercase tracking-[0.32em] text-cyan-300">Indicator Model</div>
        <h1 className="mt-2 text-4xl font-bold text-white">指标说明</h1>
        <p className="mt-3 max-w-3xl text-slate-400">评分模型模拟玩家开城时的信息评价过程。系统按固定权重计算 100 分，并输出优秀、良好、一般、不推荐等级。</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {process.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg transition-all hover:scale-105">
              <Icon className="h-7 w-7 text-cyan-300" />
              <h2 className="mt-4 text-lg font-bold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {indicators.map(([title, text]) => (
          <article key={title} className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg transition-all hover:scale-[1.02]">
            <h2 className="text-lg font-bold text-cyan-100">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <Civ6VisualGallery title="地形指标对应图片" assets={terrainGallery.slice(0, 10)} compact />
        <Civ6VisualGallery title="区域与资源指标对应图片" assets={[...districtGallery.slice(0, 8), ...resourceGallery.slice(0, 12)]} compact />
      </section>

      <section className="mt-8 rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <Image className="h-5 w-5 text-cyan-300" />
          图片素材来源
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          城市卡片与预览区使用 Civilization Wiki 的 Civilization VI 地形图片作为教学展示素材，并已缓存到本地 public/civ6-images 目录。
        </p>
      </section>
    </main>
  );
}
