import { Castle, Factory, Leaf, Mountain, Sparkles, Waves } from 'lucide-react';
import type { CityCandidate } from '../data/cities';
import { getCityRole } from '../utils/cityNarrative';
import { getCityIllustration } from '../utils/cityIllustrations';

interface CityMapMockProps {
  city: CityCandidate;
  compact?: boolean;
  danger?: boolean;
}

const terrainIcons = [Leaf, Waves, Mountain, Factory, Leaf, Waves, Mountain, Leaf, Factory];

export default function CityMapMock({ city, compact = false, danger = false }: CityMapMockProps) {
  const illustration = getCityIllustration(city);

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-slate-950/70 shadow-lg ${danger ? 'border-red-500/30' : 'border-cyan-500/20'}`}>
      <img
        src={illustration.src}
        alt={`${city.name} ${illustration.label}插图`}
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_45%),linear-gradient(135deg,rgba(15,23,42,0.2),rgba(3,7,18,0.72))]" />
      <div className={`relative grid grid-cols-3 gap-3 p-5 ${compact ? 'min-h-56' : 'min-h-[420px] content-center'}`}>
        {terrainIcons.map((Icon, index) => {
          const selected = index === 4;
          return (
            <div
              key={`${city.id}-${index}`}
              className={`flex aspect-[1.15] items-center justify-center border text-slate-300 transition-all ${
                selected
                  ? danger
                    ? 'scale-105 border-red-400 bg-red-500/20 shadow-[0_0_30px_rgba(248,113,113,0.55)]'
                    : 'scale-105 border-cyan-300 bg-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.55)]'
                  : 'border-slate-700/70 bg-slate-900/70 hover:border-cyan-400/30'
              }`}
              style={{ clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%)' }}
            >
              {selected ? <Castle className={`h-8 w-8 ${danger ? 'text-red-200' : 'text-cyan-100'}`} /> : <Icon className="h-5 w-5 opacity-70" />}
            </div>
          );
        })}
      </div>
      <div className="absolute left-4 top-4 max-w-[78%] rounded border border-cyan-400/20 bg-slate-950/80 px-3 py-2 text-xs leading-5 text-cyan-100">
        地图格子：{illustration.label} / {city.terrain}
      </div>
      <div className="absolute bottom-4 right-4 max-w-[82%] rounded border border-slate-600 bg-slate-950/80 px-3 py-2 text-xs leading-5 text-slate-300">
        <div className="flex items-center gap-2 font-bold text-white">
          <Sparkles className="h-4 w-4 text-amber-300" />
          选中地块：{city.name}
        </div>
        <div className="mt-1 text-slate-400">建成后倾向：{getCityRole(city)}</div>
      </div>
    </div>
  );
}
