import type { CityCandidate } from '../data/cities';
import { cities } from '../data/cities';
import { calculateCityScore } from './calculateCityScore';
import { getCityRole } from './cityNarrative';
import { getStrategyScore, strategyProfiles } from './strategyRecommendations';

export type KnowledgeNodeType = 'city' | 'terrain' | 'resource' | 'district' | 'strategy' | 'risk' | 'concept';
export type KnowledgeRelationType = 'has_tag' | 'has_resource' | 'fits_district' | 'supports_strategy' | 'has_risk' | 'explains';

export interface KnowledgeNode {
  id: string;
  label: string;
  type: KnowledgeNodeType;
  description: string;
  score?: number;
  radius: number;
  x: number;
  y: number;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  type: KnowledgeRelationType;
  label: string;
  strength: number;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

const importantTags = ['河流', '淡水', '丘陵', '山脉', '沿海', '港口', '学院', '科技', '工业', '军事', '贸易', '高粮', '高产能', '粮锤平衡', '防御'];

const districtRules = [
  { district: '学院', test: (city: CityCandidate) => city.tags.includes('学院') || city.tags.includes('科技') || city.tags.includes('山脉') || city.tags.includes('雨林') },
  { district: '港口', test: (city: CityCandidate) => city.tags.includes('港口') || city.tags.includes('沿海') || city.tags.includes('海岸') },
  { district: '工业区', test: (city: CityCandidate) => city.tags.includes('工业') || city.tags.includes('高产能') || city.production >= 8 },
  { district: '商业中心', test: (city: CityCandidate) => city.tags.includes('贸易') || city.tags.includes('商业') || city.districtSpace >= 8 },
  { district: '剧院广场', test: (city: CityCandidate) => city.tags.includes('文化') || city.tags.includes('剧院') },
  { district: '兵营', test: (city: CityCandidate) => city.tags.includes('军事') || city.tags.includes('边境') || city.defense >= 8 },
  { district: '圣地', test: (city: CityCandidate) => city.tags.includes('信仰') || city.tags.includes('宗教') || city.tags.includes('山脉') },
  { district: '娱乐区', test: (city: CityCandidate) => city.amenityPotential >= 8 || city.luxuryResources.length >= 2 },
];

const riskRules = [
  { label: '产能不足', test: (city: CityCandidate) => city.production <= 5, description: '造建筑和区域慢，需要矿山、砍伐或贸易路线补足。' },
  { label: '粮食不足', test: (city: CityCandidate) => city.food <= 5, description: '人口增长慢，区域解锁速度会受到影响。' },
  { label: '防御薄弱', test: (city: CityCandidate) => city.defense <= 5, description: '边境和开阔地容易受到攻击，需要城墙和驻军。' },
  { label: '空间紧张', test: (city: CityCandidate) => city.districtSpace <= 5, description: '区域落位有限，必须提前规划。' },
  { label: '住房压力', test: (city: CityCandidate) => city.housingPotential <= 5, description: '城市长大后容易卡人口，需要水渠、粮仓或淡水。' },
];

const conceptNodes: Array<Omit<KnowledgeNode, 'x' | 'y'>> = [
  { id: 'concept:settlement', label: '开城决策', type: 'concept', description: '选择新城市位置，本质是综合水源、产出、资源、区域和风险的多条件决策。', radius: 30 },
  { id: 'concept:amenity', label: '舒适度', type: 'concept', description: '城市满意度。奢侈资源和娱乐区能缓解舒适度压力，让高人口城市保持效率。', radius: 24 },
  { id: 'concept:retrieval', label: '信息检索', type: 'concept', description: '把游戏地图信息结构化后，通过标签、条件和关系快速找到合适候选点。', radius: 24 },
];

const typeAngles: Record<KnowledgeNodeType, number> = {
  concept: -90,
  city: 0,
  terrain: -35,
  resource: 42,
  district: 138,
  strategy: 205,
  risk: 270,
};

const typeRadius: Record<KnowledgeNodeType, number> = {
  concept: 24,
  city: 35,
  terrain: 36,
  resource: 38,
  district: 38,
  strategy: 32,
  risk: 32,
};

const nodeKey = (type: KnowledgeNodeType, label: string) => `${type}:${label}`;

function placeNode(node: Omit<KnowledgeNode, 'x' | 'y'>, index: number, total: number): KnowledgeNode {
  if (node.id === 'concept:settlement') return { ...node, x: 500, y: 310 };
  const baseAngle = typeAngles[node.type];
  const spread = node.type === 'city' ? 290 : 70;
  const angle = ((baseAngle - spread / 2 + (spread * index) / Math.max(1, total - 1)) * Math.PI) / 180;
  const radius = typeRadius[node.type] * 10;
  return {
    ...node,
    x: Math.round(500 + Math.cos(angle) * radius),
    y: Math.round(310 + Math.sin(angle) * radius),
  };
}

export function buildKnowledgeGraph(limit = 10): KnowledgeGraph {
  const rankedCities = [...cities].sort((a, b) => calculateCityScore(b).total - calculateCityScore(a).total).slice(0, limit);
  const nodes = new Map<string, Omit<KnowledgeNode, 'x' | 'y'>>();
  const edges: KnowledgeEdge[] = [];

  const addNode = (node: Omit<KnowledgeNode, 'x' | 'y'>) => {
    if (!nodes.has(node.id)) nodes.set(node.id, node);
  };

  const addEdge = (source: string, target: string, type: KnowledgeRelationType, label: string, strength = 1) => {
    edges.push({ id: `${source}->${target}:${type}:${edges.length}`, source, target, type, label, strength });
  };

  conceptNodes.forEach(addNode);

  rankedCities.forEach((city) => {
    const score = calculateCityScore(city).total;
    const cityId = nodeKey('city', city.id);
    addNode({
      id: cityId,
      label: city.name,
      type: 'city',
      description: `${getCityRole(city)}。${city.description}`,
      score,
      radius: score >= 85 ? 24 : score >= 75 ? 21 : 18,
    });
    addEdge('concept:settlement', cityId, 'explains', '评估候选城市', 1.4);

    city.tags.filter((tag) => importantTags.includes(tag)).slice(0, 5).forEach((tag) => {
      const tagId = nodeKey('terrain', tag);
      addNode({ id: tagId, label: tag, type: 'terrain', description: `候选地特征标签：${tag}。它会影响检索、排序和开城解释。`, radius: 16 });
      addEdge(cityId, tagId, 'has_tag', '具备特征', 1);
    });

    [...city.luxuryResources, ...city.strategicResources].slice(0, 4).forEach((resource) => {
      const resourceId = nodeKey('resource', resource);
      const isLuxury = city.luxuryResources.includes(resource);
      addNode({
        id: resourceId,
        label: resource,
        type: 'resource',
        description: isLuxury ? `${resource} 是奢侈资源，可支撑舒适度和贸易价值。` : `${resource} 是战略资源，影响军事、工业或后期科技上限。`,
        radius: 15,
      });
      addEdge(cityId, resourceId, 'has_resource', isLuxury ? '提供舒适度' : '提供战略价值', isLuxury ? 0.9 : 1.1);
      if (isLuxury) addEdge(resourceId, 'concept:amenity', 'explains', '改善舒适度', 1);
    });

    districtRules.filter((rule) => rule.test(city)).slice(0, 3).forEach((rule) => {
      const districtId = nodeKey('district', rule.district);
      addNode({ id: districtId, label: rule.district, type: 'district', description: `${rule.district} 是城市功能区，适合与相关地形、资源和城市定位联动。`, radius: 18 });
      addEdge(cityId, districtId, 'fits_district', '适合建设', 1.2);
    });

    strategyProfiles.forEach((profile) => {
      const strategyScore = getStrategyScore(city, profile);
      if (strategyScore < 82) return;
      const strategyId = nodeKey('strategy', profile.label);
      addNode({ id: strategyId, label: profile.label, type: 'strategy', description: profile.summary, radius: 19 });
      addEdge(cityId, strategyId, 'supports_strategy', `匹配度 ${strategyScore}`, strategyScore / 80);
    });

    riskRules.filter((rule) => rule.test(city)).slice(0, 2).forEach((rule) => {
      const riskId = nodeKey('risk', rule.label);
      addNode({ id: riskId, label: rule.label, type: 'risk', description: rule.description, radius: 15 });
      addEdge(cityId, riskId, 'has_risk', '需要补救', 0.8);
    });
  });

  addEdge('concept:retrieval', 'concept:settlement', 'explains', '服务决策', 1.2);
  addEdge('concept:amenity', 'concept:settlement', 'explains', '影响长期效率', 1);

  const grouped = Array.from(nodes.values()).reduce<Record<KnowledgeNodeType, Array<Omit<KnowledgeNode, 'x' | 'y'>>>>((acc, node) => {
    acc[node.type].push(node);
    return acc;
  }, { city: [], terrain: [], resource: [], district: [], strategy: [], risk: [], concept: [] });

  const placedNodes = (Object.keys(grouped) as KnowledgeNodeType[]).flatMap((type) =>
    grouped[type].map((node, index) => placeNode(node, index, grouped[type].length)),
  );

  return { nodes: placedNodes, edges };
}
