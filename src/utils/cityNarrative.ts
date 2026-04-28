import type { CityCandidate } from '../data/cities';
import { calculateCityScore } from './calculateCityScore';

export function getCityRole(city: CityCandidate) {
  if (city.tags.includes('港口') || city.tags.includes('贸易')) return '赚钱和跑商路的港口/商业城';
  if (city.tags.includes('工业') || city.tags.includes('高产能')) return '负责造建筑和单位的工业城';
  if (city.tags.includes('军事') || city.tags.includes('边境')) return '守边境、控资源的军事前哨';
  if (city.tags.includes('学院') || city.tags.includes('科技')) return '提高科研速度的学院城';
  if (city.tags.includes('文化') || city.tags.includes('剧院')) return '提升文化和旅游的文化城';
  if (city.tags.includes('信仰') || city.tags.includes('宗教')) return '积累信仰的宗教城';
  return '兼顾成长、建设和经济的综合城市';
}

export function getBeginnerVerdict(city: CityCandidate) {
  const score = calculateCityScore(city);
  if (score.total >= 85) return '很适合新手选择：基础条件好，容错率高。';
  if (score.total >= 75) return '值得开城：有明确优势，但需要补一两个短板。';
  if (score.total >= 60) return '可以考虑：更适合作为特定功能城市，不建议盲目优先。';
  return '不建议优先：前期投入成本高，容易拖慢整体节奏。';
}

export function getSimpleReason(city: CityCandidate) {
  const strengths = [
    city.waterSource.includes('淡水') || city.waterSource.includes('河') || city.waterSource.includes('湖') ? '有水源，城市更容易长人口' : '',
    city.food >= 8 ? '粮食高，人口增长快' : '',
    city.production >= 8 ? '产能高，造东西更快' : '',
    city.amenityPotential >= 8 ? '舒适度好，人口多了也不容易掉效率' : '',
    city.defense >= 8 ? '地形安全，适合边境防守' : '',
    city.districtSpace >= 8 ? '空地多，后续区域好规划' : '',
    city.luxuryResources.length >= 2 ? '奢侈资源多，可以提高整体宜居度' : '',
  ].filter(Boolean);

  return strengths.slice(0, 3);
}

export function getOpeningPlan(city: CityCandidate) {
  const plan = ['先派侦察兵探周围资源和敌人位置'];
  if (city.food < 6) plan.push('尽快修农场或用商路补粮，避免城市长不起来');
  else plan.push('优先改良高粮地块，让人口尽快到 4 人以上');

  if (city.production >= 8) plan.push('利用高产能快速建区域或单位，抢节奏');
  else plan.push('优先补矿山、森林砍伐或购买建筑，弥补产能不足');

  if (city.tags.includes('学院') || city.tags.includes('科技')) plan.push('提前锁定学院位置，利用山脉或雨林邻接');
  else if (city.tags.includes('港口') || city.tags.includes('贸易')) plan.push('先规划港口或商业中心，尽快开商路');
  else if (city.tags.includes('军事') || city.tags.includes('边境')) plan.push('补城墙和驻军，把它当作前线据点');
  else if (city.tags.includes('工业') || city.tags.includes('高产能')) plan.push('尽早放工业区，让这座城承担生产任务');
  else plan.push('先建商业中心或学院，保证经济和科技不断档');

  return plan.slice(0, 4);
}

export const beginnerGlossary = [
  { label: '粮食', text: '决定人口增长。人口越多，能工作更多地块，也能解锁更多区域。' },
  { label: '产能', text: '决定建造速度。产能高，城市造建筑、单位和奇观都更快。' },
  { label: '水源', text: '影响住房。淡水城市更容易长大，单纯沿海通常住房压力更高。' },
  { label: '舒适度', text: '可以理解为市民满意度。太低会让城市产出变差。' },
  { label: '区域', text: '城市里的功能区，例如学院负责科技，港口负责贸易，工业区负责生产。' },
  { label: '开城', text: '就是让开拓者在某个地块建立新城市，是整局游戏最关键的选择之一。' },
];
