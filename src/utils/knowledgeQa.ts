import type { CityCandidate } from '../data/cities';
import { cities } from '../data/cities';
import { calculateCityScore } from './calculateCityScore';
import { getBeginnerVerdict, getCityRole, getOpeningPlan, getSimpleReason } from './cityNarrative';
import { getStrategyScore, strategyProfiles } from './strategyRecommendations';

export interface QaEvidence {
  path: string;
  explanation: string;
}

export interface QaAnswer {
  question: string;
  answer: string;
  evidence: QaEvidence[];
  relatedCities: CityCandidate[];
  confidence: '高' | '中' | '低';
}

export const sampleQuestions = [
  '哪个城市最适合科技胜利？',
  '哪些城市适合建学院？',
  '哪些资源可以改善舒适度？',
  '高产能城市有哪些？',
  '沿海城市适合做什么？',
  '哪个城市风险最低？',
  '山脉有什么用？',
  '雨林科研城为什么适合科研？',
  '我想要贸易经济，推荐哪里开城？',
  '哪些城市不适合新手优先开？',
];

const districtKeywords = ['学院', '港口', '工业区', '商业中心', '剧院广场', '兵营', '圣地', '娱乐区'];

const includesAny = (text: string, words: string[]) => words.some((word) => text.includes(word));

const formatCityLine = (city: CityCandidate) => {
  const score = calculateCityScore(city);
  return `${city.name}（${score.total}分，${getCityRole(city)}）`;
};

const rankByScore = (items: CityCandidate[]) => [...items].sort((a, b) => calculateCityScore(b).total - calculateCityScore(a).total);

const riskCount = (city: CityCandidate) =>
  [
    city.food <= 5,
    city.production <= 5,
    city.defense <= 5,
    city.districtSpace <= 5,
    city.housingPotential <= 5,
    city.amenityPotential <= 5,
  ].filter(Boolean).length;

const districtMatches = (district: string) => {
  if (district === '学院') return cities.filter((city) => includesAny(city.tags.join(''), ['学院', '科技', '山脉', '雨林']));
  if (district === '港口') return cities.filter((city) => includesAny(city.tags.join(''), ['港口', '沿海', '海岸']));
  if (district === '工业区') return cities.filter((city) => city.production >= 8 || includesAny(city.tags.join(''), ['工业', '高产能']));
  if (district === '商业中心') return cities.filter((city) => includesAny(city.tags.join(''), ['商业', '贸易']) || city.districtSpace >= 8);
  if (district === '剧院广场') return cities.filter((city) => includesAny(city.tags.join(''), ['文化', '剧院']));
  if (district === '兵营') return cities.filter((city) => includesAny(city.tags.join(''), ['军事', '边境']) || city.defense >= 8);
  if (district === '圣地') return cities.filter((city) => includesAny(city.tags.join(''), ['信仰', '宗教', '山脉']));
  if (district === '娱乐区') return cities.filter((city) => city.amenityPotential >= 8 || city.luxuryResources.length >= 2);
  return [];
};

const cityByName = (question: string) => cities.find((city) => question.includes(city.name));

const strategyByQuestion = (question: string) =>
  strategyProfiles.find((profile) => question.includes(profile.label.replace('胜利', '')) || question.includes(profile.label) || question.includes(profile.cityRole.replace('城', '')));

export function answerKnowledgeQuestion(rawQuestion: string): QaAnswer {
  const question = rawQuestion.trim() || '哪个城市最适合开城？';
  const city = cityByName(question);
  const strategy = strategyByQuestion(question);
  const district = districtKeywords.find((item) => question.includes(item));

  if (city && includesAny(question, ['为什么', '适合', '推荐', '怎么', '如何'])) {
    const reasons = getSimpleReason(city);
    const plan = getOpeningPlan(city);
    return {
      question,
      answer: `${city.name}的定位是${getCityRole(city)}。${getBeginnerVerdict(city)}主要依据是：${reasons.join('；') || city.recommendation}。前期可以按“${plan.slice(0, 3).join(' → ')}”推进。`,
      evidence: [
        { path: `${city.name} → 标签 → ${city.tags.slice(0, 4).join(' / ')}`, explanation: '标签节点说明它的主要地形和功能特征。' },
        { path: `${city.name} → 资源 → ${[...city.luxuryResources, ...city.strategicResources].slice(0, 4).join(' / ') || '暂无'}`, explanation: '资源节点影响舒适度、贸易价值和战略上限。' },
        { path: `${city.name} → 风险 → ${city.risks.slice(0, 2).join('；')}`, explanation: '风险节点解释为什么需要补救措施。' },
      ],
      relatedCities: [city],
      confidence: '高',
    };
  }

  if (strategy) {
    const ranked = [...cities]
      .map((item) => ({ city: item, strategyScore: getStrategyScore(item, strategy) }))
      .sort((a, b) => b.strategyScore - a.strategyScore)
      .slice(0, 5);
    const best = ranked[0];
    return {
      question,
      answer: `如果目标是${strategy.label}，最推荐${best.city.name}，策略匹配分 ${best.strategyScore}。备选城市包括：${ranked.slice(1).map((item) => `${item.city.name}（${item.strategyScore}）`).join('、')}。`,
      evidence: [
        { path: `${strategy.label} → 推荐区域 → ${strategy.districts.join(' / ')}`, explanation: '策略节点先决定城市应该服务哪些区域。' },
        { path: `${best.city.name} → 支持策略 → ${strategy.label}`, explanation: `${best.city.name}在该策略权重下匹配度最高。` },
        { path: `${best.city.name} → 标签/资源 → ${[...best.city.tags.slice(0, 3), ...best.city.strategicResources.slice(0, 2)].join(' / ')}`, explanation: '这些节点共同支撑策略推荐。' },
      ],
      relatedCities: ranked.map((item) => item.city),
      confidence: '高',
    };
  }

  if (district) {
    const matched = rankByScore(districtMatches(district)).slice(0, 6);
    return {
      question,
      answer: `适合建设${district}的城市有：${matched.map(formatCityLine).join('、')}。这些城市通常具备相关地形、资源或功能标签。`,
      evidence: matched.slice(0, 3).map((item) => ({
        path: `${item.name} → 适合区域 → ${district}`,
        explanation: `${item.name}的标签或基础指标与${district}需求匹配。`,
      })),
      relatedCities: matched,
      confidence: matched.length > 0 ? '高' : '低',
    };
  }

  if (includesAny(question, ['舒适度', '宜居', '奢侈'])) {
    const matched = rankByScore(cities.filter((item) => item.amenityPotential >= 8 || item.luxuryResources.length >= 2)).slice(0, 6);
    const resources = Array.from(new Set(matched.flatMap((item) => item.luxuryResources))).slice(0, 10);
    return {
      question,
      answer: `改善舒适度主要依赖奢侈资源和娱乐区。当前数据里舒适度较好的城市有：${matched.map(formatCityLine).join('、')}。相关奢侈资源包括：${resources.join('、')}。`,
      evidence: [
        { path: `奢侈资源 → 舒适度 → 开城决策`, explanation: '奢侈资源节点会连接到舒适度概念，影响长期城市效率。' },
        { path: `${matched[0]?.name ?? '候选城市'} → 奢侈资源 → ${matched[0]?.luxuryResources.join(' / ') ?? '暂无'}`, explanation: '资源越稳定，高人口城市越不容易降低效率。' },
      ],
      relatedCities: matched,
      confidence: '高',
    };
  }

  if (includesAny(question, ['高产能', '产能', '工业', '锤'])) {
    const matched = rankByScore(cities.filter((item) => item.production >= 8 || item.tags.includes('高产能') || item.tags.includes('工业'))).slice(0, 6);
    return {
      question,
      answer: `高产能城市优先看丘陵、矿山、森林和战略资源。推荐：${matched.map(formatCityLine).join('、')}。`,
      evidence: matched.slice(0, 3).map((item) => ({
        path: `${item.name} → 高产能/工业 → 工业区`,
        explanation: `产能 ${item.production}/10，适合承担建筑、单位和工业区建设。`,
      })),
      relatedCities: matched,
      confidence: '高',
    };
  }

  if (includesAny(question, ['沿海', '海岸', '港口', '贸易'])) {
    const matched = rankByScore(cities.filter((item) => includesAny(item.tags.join(''), ['沿海', '海岸', '港口', '贸易', '商业']))).slice(0, 6);
    return {
      question,
      answer: `沿海或贸易型城市通常适合港口、商业中心和商路经济。推荐：${matched.map(formatCityLine).join('、')}。`,
      evidence: matched.slice(0, 3).map((item) => ({
        path: `${item.name} → 沿海/贸易 → 港口或商业中心`,
        explanation: item.recommendation,
      })),
      relatedCities: matched,
      confidence: '高',
    };
  }

  if (includesAny(question, ['风险最低', '最稳', '新手', '优先'])) {
    const matched = [...cities]
      .sort((a, b) => riskCount(a) - riskCount(b) || calculateCityScore(b).total - calculateCityScore(a).total)
      .slice(0, 6);
    return {
      question,
      answer: `更适合新手或低风险开城的城市有：${matched.map(formatCityLine).join('、')}。它们通常水源、粮锤、住房或舒适度更均衡。`,
      evidence: matched.slice(0, 3).map((item) => ({
        path: `${item.name} → 风险节点数量 ${riskCount(item)} → 开城决策`,
        explanation: getBeginnerVerdict(item),
      })),
      relatedCities: matched,
      confidence: '中',
    };
  }

  if (includesAny(question, ['山脉', '雨林', '河流', '丘陵', '火山', '沙漠'])) {
    const keyword = ['山脉', '雨林', '河流', '丘陵', '火山', '沙漠'].find((item) => question.includes(item))!;
    const matched = rankByScore(cities.filter((item) => item.tags.includes(keyword) || item.terrain.includes(keyword) || item.description.includes(keyword))).slice(0, 6);
    return {
      question,
      answer: `${keyword}在图谱里是地形/标签节点，会影响城市定位。相关城市有：${matched.map(formatCityLine).join('、')}。`,
      evidence: matched.slice(0, 3).map((item) => ({
        path: `${keyword} → 具备特征 → ${item.name}`,
        explanation: item.description,
      })),
      relatedCities: matched,
      confidence: matched.length > 0 ? '高' : '低',
    };
  }

  const topCities = rankByScore(cities).slice(0, 5);
  return {
    question,
    answer: `我没有识别到非常明确的图谱意图，先按综合开城价值回答：推荐 ${topCities.map(formatCityLine).join('、')}。你也可以问“哪个城市适合科技胜利”“哪些城市适合建学院”“舒适度靠什么提升”。`,
    evidence: topCities.slice(0, 3).map((item) => ({
      path: `开城决策 → 评估候选城市 → ${item.name}`,
      explanation: `${item.name}综合评分 ${calculateCityScore(item).total}，${item.recommendation}`,
    })),
    relatedCities: topCities,
    confidence: '低',
  };
}
