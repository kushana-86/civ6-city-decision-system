export interface VisualAsset {
  label: string;
  src: string;
  note?: string;
}

const terrain = (file: string) => `/civ6-images/${file}`;
const district = (file: string) => `/civ6-districts/${file}`;
const resource = (file: string) => `/civ6-resources/${file}`;

export const terrainGallery: VisualAsset[] = [
  { label: '草原', src: terrain('grassland.png'), note: '高粮成长' },
  { label: '丘陵', src: terrain('hills.png'), note: '提高产能' },
  { label: '山脉', src: terrain('mountains.png'), note: '防御与学院邻接' },
  { label: '海岸', src: terrain('coast.png'), note: '港口贸易' },
  { label: '雨林', src: terrain('rainforest.png'), note: '人口和科研潜力' },
  { label: '森林', src: terrain('forest.png'), note: '产能与砍伐' },
  { label: '沙漠', src: terrain('desert.png'), note: '奇观和后期规划' },
  { label: '泛滥平原', src: terrain('floodplains.png'), note: '高粮但有洪水' },
  { label: '绿洲', src: terrain('oasis.png'), note: '沙漠生存点' },
  { label: '湖泊', src: terrain('lake.png'), note: '淡水住房' },
  { label: '礁石', src: terrain('reef.png'), note: '学院邻接' },
  { label: '火山', src: terrain('volcano.png'), note: '高收益高风险' },
  { label: '冻土', src: terrain('tundra.png'), note: '边境和资源点' },
  { label: '沼泽', src: terrain('marsh.png'), note: '改良成本高' },
];

export const districtGallery: VisualAsset[] = [
  { label: '市中心', src: district('city-center.png'), note: '城市本体' },
  { label: '学院', src: district('campus.png'), note: '科技' },
  { label: '商业中心', src: district('commercial-hub.png'), note: '金币和商路' },
  { label: '港口', src: district('harbor.png'), note: '海上贸易' },
  { label: '工业区', src: district('industrial-zone.png'), note: '生产力' },
  { label: '剧院广场', src: district('theater-square.png'), note: '文化' },
  { label: '兵营', src: district('encampment.png'), note: '军事' },
  { label: '圣地', src: district('holy-site.png'), note: '信仰' },
  { label: '娱乐区', src: district('entertainment-complex.png'), note: '舒适度' },
  { label: '水渠', src: district('aqueduct.png'), note: '住房' },
  { label: '水坝', src: district('dam.png'), note: '防洪与工业' },
  { label: '运河', src: district('canal.png'), note: '交通枢纽' },
  { label: '航天中心', src: district('spaceport.png'), note: '科技胜利' },
  { label: '社区', src: district('neighborhood.png'), note: '后期住房' },
];

export const districtSceneGallery: VisualAsset[] = [
  { label: '港口实景', src: district('harbor-ingame.png'), note: '海岸城市会变成贸易节点' },
  { label: '工业区实景', src: district('industrial-zone-ingame.png'), note: '高产能城市负责建设' },
  { label: '剧院广场实景', src: district('theater-square-ingame.png'), note: '文化路线的核心区域' },
  { label: '圣地实景', src: district('holy-site-ingame.png'), note: '宗教和信仰来源' },
  { label: '兵营实景', src: district('encampment-ingame.png'), note: '边境防御和军事生产' },
  { label: '娱乐区实景', src: district('entertainment-complex-ingame.png'), note: '提高城市舒适度' },
];

export const resourceAssetMap: Record<string, VisualAsset> = {
  铁: { label: '铁', src: resource('iron.png'), note: '古典军队' },
  马: { label: '马', src: resource('horses.png'), note: '骑兵路线' },
  硝石: { label: '硝石', src: resource('niter.png'), note: '火药时代' },
  煤: { label: '煤', src: resource('coal.png'), note: '工业化' },
  石油: { label: '石油', src: resource('oil.png'), note: '现代军工' },
  铝: { label: '铝', src: resource('aluminum.png'), note: '飞机与太空' },
  铀: { label: '铀', src: resource('uranium.png'), note: '核能与末期' },
  珍珠: { label: '珍珠', src: resource('pearls.png'), note: '奢侈资源' },
  钻石: { label: '钻石', src: resource('diamonds.png'), note: '奢侈资源' },
  香料: { label: '香料', src: resource('spices.png'), note: '奢侈资源' },
  丝绸: { label: '丝绸', src: resource('silk.png'), note: '奢侈资源' },
  茶叶: { label: '茶叶', src: resource('tea.png'), note: '奢侈资源' },
  可可: { label: '可可', src: resource('cocoa.png'), note: '奢侈资源' },
  柑橘: { label: '柑橘', src: resource('citrus.png'), note: '奢侈资源' },
  糖: { label: '糖', src: resource('sugar.png'), note: '奢侈资源' },
  棉花: { label: '棉花', src: resource('cotton.png'), note: '奢侈资源' },
  葡萄酒: { label: '葡萄酒', src: resource('wine.png'), note: '奢侈资源' },
  盐: { label: '盐', src: resource('salt.png'), note: '奢侈资源' },
  鲸鱼: { label: '鲸鱼', src: resource('whales.png'), note: '奢侈资源' },
  咖啡: { label: '咖啡', src: resource('coffee.png'), note: '奢侈资源' },
  毛皮: { label: '毛皮', src: resource('furs.png'), note: '奢侈资源' },
  玉石: { label: '玉石', src: resource('jade.png'), note: '奢侈资源' },
  石膏: { label: '石膏', src: resource('gypsum.png'), note: '奢侈资源' },
  松露: { label: '松露', src: resource('truffles.png'), note: '奢侈资源' },
};

export const resourceGallery = Object.values(resourceAssetMap);

export function getResourceAssets(resources: string[]) {
  return resources.map((item) => resourceAssetMap[item]).filter(Boolean);
}

export function getDistrictAsset(name: string) {
  return districtGallery.find((item) => item.label === name);
}
