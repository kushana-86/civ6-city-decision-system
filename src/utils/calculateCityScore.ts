import type { CityCandidate } from '../data/cities';

export interface ScoreBreakdownItem {
  key: string;
  label: string;
  value: number;
  weight: number;
  weighted: number;
}

export interface CityScore {
  total: number;
  rating: '优秀' | '良好' | '一般' | '不推荐';
  breakdown: ScoreBreakdownItem[];
}

const clampScore = (value: number) => Math.max(0, Math.min(10, value));

const waterScore = (waterSource: string) => {
  if (waterSource.includes('淡水') || waterSource.includes('大河') || waterSource.includes('河流')) return 10;
  if (waterSource.includes('湖') || waterSource.includes('绿洲') || waterSource.includes('山泉')) return 8;
  if (waterSource.includes('海岸')) return 6;
  return 4;
};

const weightedItems = [
  { key: 'water', label: '水源条件', weight: 15 },
  { key: 'food', label: '粮食产出', weight: 15 },
  { key: 'production', label: '产能产出', weight: 15 },
  { key: 'luxury', label: '奢侈资源', weight: 15 },
  { key: 'housing', label: '住房潜力', weight: 10 },
  { key: 'defense', label: '防御优势', weight: 10 },
  { key: 'district', label: '区域规划', weight: 10 },
  { key: 'strategic', label: '战略资源', weight: 10 },
] as const;

export function calculateCityScore(city: CityCandidate): CityScore {
  const rawScores: Record<string, number> = {
    water: waterScore(city.waterSource),
    food: city.food,
    production: city.production,
    luxury: Math.min(10, city.luxuryResources.length * 3.5),
    housing: city.housingPotential,
    defense: city.defense,
    district: city.districtSpace,
    strategic: Math.min(10, city.strategicResources.length * 3.5),
  };

  const breakdown = weightedItems.map((item) => {
    const value = clampScore(rawScores[item.key]);
    return {
      ...item,
      value,
      weighted: value * item.weight,
    };
  });

  const total = Math.round(breakdown.reduce((sum, item) => sum + item.weighted, 0) / 10);
  let rating: CityScore['rating'] = '不推荐';
  if (total >= 90) rating = '优秀';
  else if (total >= 75) rating = '良好';
  else if (total >= 60) rating = '一般';

  return { total, rating, breakdown };
}
