import type { CityCandidate } from '../data/cities';
import { calculateCityScore } from './calculateCityScore';

export type StrategyKey = 'science' | 'culture' | 'industry' | 'military' | 'trade' | 'balanced';

export interface StrategyProfile {
  key: StrategyKey;
  label: string;
  summary: string;
  cityRole: string;
  buildOrder: string[];
  districts: string[];
  policyFocus: string[];
  riskRules: Array<{
    test: (city: CityCandidate) => boolean;
    message: string;
  }>;
  weights: {
    base: number;
    food: number;
    production: number;
    housing: number;
    amenity: number;
    defense: number;
    district: number;
    luxury: number;
    strategic: number;
    tags: Record<string, number>;
  };
}

export const strategyProfiles: StrategyProfile[] = [
  {
    key: 'science',
    label: '科技胜利',
    summary: '优先寻找学院邻接、人口成长和稳定住房，适合把城市培养成科研与伟人点数核心。',
    cityRole: '学院科研城',
    buildOrder: ['侦察兵', '建造者', '学院', '图书馆', '商业中心或港口', '工业区'],
    districts: ['学院', '商业中心', '工业区', '水渠'],
    policyFocus: ['科研邻接翻倍', '伟人点数', '贸易线补粮补锤'],
    riskRules: [
      { test: (city) => city.production < 6, message: '产能偏低，建议先用贸易路线或砍伐补学院建设速度。' },
      { test: (city) => city.districtSpace < 6, message: '区域空间紧张，学院位置需要在开城前锁定。' },
    ],
    weights: {
      base: 0.35,
      food: 1.4,
      production: 1.1,
      housing: 1.0,
      amenity: 0.8,
      defense: 0.4,
      district: 1.2,
      luxury: 1.0,
      strategic: 0.7,
      tags: { 学院: 16, 科技: 14, 山脉: 9, 雨林: 7, 河流: 5, 淡水: 5 },
    },
  },
  {
    key: 'culture',
    label: '文化胜利',
    summary: '关注高人口、宜居度、奢侈资源和剧院空间，适合承载剧院广场、娱乐区和奇观。',
    cityRole: '文化剧院城',
    buildOrder: ['纪念碑', '建造者', '剧院广场', '娱乐区', '商业中心', '奇观或博物馆'],
    districts: ['剧院广场', '娱乐区', '商业中心', '圣地'],
    policyFocus: ['文化建筑加速', '奇观生产', '宜居度与旅游收益'],
    riskRules: [
      { test: (city) => city.production < 5, message: '奇观和剧院建筑会慢，建议先补矿山或商路。' },
      { test: (city) => city.amenityPotential < 7, message: '宜居度不够稳定，娱乐区或奢侈资源交易优先级应提高。' },
    ],
    weights: {
      base: 0.35,
      food: 1.3,
      production: 0.9,
      housing: 1.1,
      amenity: 1.4,
      defense: 0.4,
      district: 1.3,
      luxury: 1.8,
      strategic: 0.2,
      tags: { 文化: 18, 剧院: 16, 奇观: 10, 奢侈资源: 9, 高粮: 6, 河流: 5 },
    },
  },
  {
    key: 'industry',
    label: '工业生产',
    summary: '面向工业区、军工和基础设施爆发，优先高产能、丘陵矿山与战略资源。',
    cityRole: '工业生产城',
    buildOrder: ['建造者', '矿山改良', '工业区', '工坊', '商业中心', '兵营或水坝'],
    districts: ['工业区', '商业中心', '水坝', '兵营'],
    policyFocus: ['工业区邻接', '建造者次数', '战略资源开发'],
    riskRules: [
      { test: (city) => city.food < 6, message: '粮食不足会限制人口与区域数量，需要农场三角或内贸补粮。' },
      { test: (city) => city.amenityPotential < 6, message: '高人口后宜居度压力明显，提前接入奢侈资源。' },
    ],
    weights: {
      base: 0.3,
      food: 0.7,
      production: 2.2,
      housing: 0.7,
      amenity: 0.7,
      defense: 0.8,
      district: 1.2,
      luxury: 0.5,
      strategic: 1.6,
      tags: { 高产能: 16, 工业: 16, 丘陵: 9, 矿山: 9, 森林: 6, 战略资源: 8 },
    },
  },
  {
    key: 'military',
    label: '军事扩张',
    summary: '强调防御、战略资源和前线控点，适合兵营、城墙、骑兵或军工生产。',
    cityRole: '军事前哨城',
    buildOrder: ['投石兵或勇士', '兵营', '城墙', '建造者', '工业区', '战略资源改良'],
    districts: ['兵营', '工业区', '商业中心', '娱乐区'],
    policyFocus: ['单位生产加速', '城墙与驻军', '战略资源积累'],
    riskRules: [
      { test: (city) => city.food < 5, message: '人口成长慢，前线城市需要内贸或粮仓保证区域解锁。' },
      { test: (city) => city.defense < 7, message: '防御不足，不适合孤立前压，建议与道路和驻军联动。' },
    ],
    weights: {
      base: 0.25,
      food: 0.6,
      production: 1.7,
      housing: 0.5,
      amenity: 0.5,
      defense: 2.2,
      district: 0.8,
      luxury: 0.3,
      strategic: 2.0,
      tags: { 军事: 18, 防御: 15, 边境: 12, 战略资源: 12, 高产能: 8, 骑兵: 8 },
    },
  },
  {
    key: 'trade',
    label: '贸易经济',
    summary: '优先港口、商业中心、河口和奢侈资源，适合提供金币、商路和区域服务。',
    cityRole: '贸易枢纽城',
    buildOrder: ['建造者', '商业中心或港口', '市场或灯塔', '娱乐区', '工业区', '商人项目'],
    districts: ['商业中心', '港口', '娱乐区', '工业区'],
    policyFocus: ['商路容量', '金币收益', '奢侈资源交易'],
    riskRules: [
      { test: (city) => city.production < 5, message: '基础产能偏弱，市场、灯塔和港口需要购买或内贸支持。' },
      { test: (city) => city.defense < 5, message: '贸易城容易成为目标，建议道路、城墙和远程单位同步安排。' },
    ],
    weights: {
      base: 0.35,
      food: 1.0,
      production: 0.8,
      housing: 0.9,
      amenity: 1.2,
      defense: 0.5,
      district: 1.4,
      luxury: 1.7,
      strategic: 0.5,
      tags: { 贸易: 18, 港口: 16, 商业: 14, 沿海: 8, 河流: 7, 奢侈资源: 9, 运河: 8 },
    },
  },
  {
    key: 'balanced',
    label: '稳健开局',
    summary: '追求粮锤平衡、淡水、宜居度和低风险，适合第一批分城与综合发展。',
    cityRole: '综合核心城',
    buildOrder: ['侦察兵', '建造者', '粮仓', '商业中心', '学院或工业区', '娱乐区'],
    districts: ['商业中心', '学院', '工业区', '娱乐区'],
    policyFocus: ['城市成长', '基础设施', '经济与科研同步'],
    riskRules: [
      { test: (city) => Math.abs(city.food - city.production) > 3, message: '粮锤不平衡，成长或建设节奏会出现明显短板。' },
      { test: (city) => city.housingPotential < 6, message: '住房上限偏低，粮仓、水渠或淡水改良需要提前排期。' },
    ],
    weights: {
      base: 0.45,
      food: 1.2,
      production: 1.2,
      housing: 1.1,
      amenity: 1.1,
      defense: 0.8,
      district: 1.1,
      luxury: 1.0,
      strategic: 0.7,
      tags: { 粮锤平衡: 14, 河流: 8, 淡水: 8, 奢侈资源: 6, 草丘: 6, 区域规划: 6 },
    },
  },
];

export function getStrategyScore(city: CityCandidate, profile: StrategyProfile) {
  const cityScore = calculateCityScore(city).total;
  const tagBonus = city.tags.reduce((sum, tag) => sum + (profile.weights.tags[tag] ?? 0), 0);
  const raw =
    cityScore * profile.weights.base +
    city.food * profile.weights.food +
    city.production * profile.weights.production +
    city.housingPotential * profile.weights.housing +
    city.amenityPotential * profile.weights.amenity +
    city.defense * profile.weights.defense +
    city.districtSpace * profile.weights.district +
    city.luxuryResources.length * profile.weights.luxury * 2 +
    city.strategicResources.length * profile.weights.strategic * 2 +
    tagBonus;

  return Math.min(100, Math.round(raw));
}

export function getStrategyRisks(city: CityCandidate, profile: StrategyProfile) {
  const risks = profile.riskRules.filter((rule) => rule.test(city)).map((rule) => rule.message);
  return risks.length > 0 ? risks : ['该城市与当前路线匹配度较高，主要风险来自开城节奏和邻城竞争。'];
}

export function getTopStrategyCities(cities: CityCandidate[], profile: StrategyProfile) {
  return [...cities]
    .map((city) => ({ city, strategyScore: getStrategyScore(city, profile) }))
    .sort((a, b) => b.strategyScore - a.strategyScore);
}
