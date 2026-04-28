import type { CityCandidate } from '../data/cities';

export interface CityIllustration {
  src: string;
  label: string;
}

const tile = (file: string) => `/civ6-images/${file}`;

const cityTileMap: Record<string, CityIllustration> = {
  'river-hill-plains': { src: tile('grassland-hills.png'), label: '河流丘陵地块' },
  'coastal-luxury-bay': { src: tile('coast.png'), label: '沿海奢侈资源地块' },
  'mountain-campus': { src: tile('mountains.png'), label: '山脉学院地块' },
  'desert-oasis': { src: tile('oasis.png'), label: '沙漠绿洲地块' },
  'industrial-hammerland': { src: tile('hills.png'), label: '高锤工业地块' },
  'rainforest-research': { src: tile('rainforest.png'), label: '雨林科研地块' },
  'frontier-fortress': { src: tile('hills.png'), label: '丘陵军事地块' },
  'grassland-granary': { src: tile('grassland.png'), label: '高粮草原地块' },
  'lake-commercial-hub': { src: tile('lake.png'), label: '粮锤平衡商业地块' },
  'volcano-fertile-ring': { src: tile('volcano.png'), label: '高收益火山地块' },
  'island-harbor-city': { src: tile('coast.png'), label: '群岛港口地块' },
  'tundra-faith-outpost': { src: tile('tundra.png'), label: '冻土信仰前哨' },
  'river-cultural-theater': { src: tile('grassland.png'), label: '河岸文化地块' },
  'horse-steppe-city': { src: tile('grassland.png'), label: '草原马场地块' },
  'jungle-river-campus': { src: tile('rainforest.png'), label: '雨林河谷地块' },
  'canal-trade-crossing': { src: tile('coast.png'), label: '河口港口贸易地块' },
  'iron-mountain-forge': { src: tile('hills.png'), label: '高锤矿山地块' },
  'floodplain-dam-city': { src: tile('floodplains.png'), label: '泛滥平原水坝地块' },
  'desert-petra-site': { src: tile('desert.png'), label: '佩特拉沙漠地块' },
  'reef-science-coast': { src: tile('reef.png'), label: '礁石科研海岸' },
  'forest-lumber-town': { src: tile('forest.png'), label: '森林伐木地块' },
  'holy-mountain-valley': { src: tile('mountains.png'), label: '圣山宗教谷地' },
  'border-river-chokepoint': { src: tile('grassland-hills.png'), label: '边境河流隘口' },
  'marsh-reclamation-city': { src: tile('marsh.png'), label: '沼泽低地改良地块' },
  'plains-campus-crossroad': { src: tile('plains.png'), label: '平原学院节点' },
  'coastal-cliff-defense': { src: tile('coast.png'), label: '海崖防御港口' },
};

export function getCityIllustration(city: CityCandidate): CityIllustration {
  const explicitMatch = cityTileMap[city.id];
  if (explicitMatch) return explicitMatch;

  const content = [
    city.name,
    city.terrain,
    city.waterSource,
    city.description,
    ...city.tags,
  ].join(' ');

  const has = (...keywords: string[]) => keywords.some((keyword) => content.includes(keyword));

  if (has('火山')) return { src: tile('volcano.png'), label: '火山地块' };
  if (has('礁石')) return { src: tile('reef.png'), label: '礁石' };
  if (has('冻土')) return { src: tile('tundra.png'), label: '冻土' };
  if (has('沼泽')) return { src: tile('marsh.png'), label: '沼泽' };
  if (has('湖泊')) return { src: tile('lake.png'), label: '湖泊' };
  if (has('粮锤平衡')) return { src: tile('grassland-hills.png'), label: '粮锤平衡地块' };
  if (has('高产能', '工业', '矿山', '铁山', '锻造')) return { src: tile('hills.png'), label: '高锤地块' };
  if (has('高粮', '高粮食', '粮食城', '粮仓')) return { src: tile('grassland.png'), label: '高粮地块' };
  if (has('泛滥平原', '水坝')) return { src: tile('floodplains.png'), label: '泛滥平原' };
  if (has('绿洲')) return { src: tile('oasis.png'), label: '绿洲' };
  if (has('沙漠')) return { src: tile('desert.png'), label: '沙漠' };
  if (has('沿海', '海岸', '港口', '礁石', '群岛', '海崖')) return { src: tile('coast.png'), label: '沿海' };
  if (has('河流', '大河', '淡水', '河岸', '河谷', '近河', '小河', '河口')) return { src: tile('grassland-hills.png'), label: '河流' };
  if (has('山脉', '山脚', '圣山')) return { src: tile('mountains.png'), label: '山脉' };
  if (has('雨林')) return { src: tile('rainforest.png'), label: '雨林' };
  if (has('森林')) return { src: tile('forest.png'), label: '森林' };
  if (has('草丘', '草原丘陵')) return { src: tile('grassland-hills.png'), label: '草丘' };
  if (has('平丘', '平原丘陵')) return { src: tile('hills.png'), label: '平丘' };
  if (has('丘陵')) return { src: tile('hills.png'), label: '丘陵' };
  if (has('草原')) return { src: tile('grassland.png'), label: '草原' };
  if (city.luxuryResources.length > 0 || city.strategicResources.length > 0) {
    return { src: tile('grassland.png'), label: '资源地块' };
  }
  return { src: tile('plains.png'), label: '平原' };
}
