import { Building2, Droplets, Hammer, Leaf, MapPinned, Smile } from 'lucide-react';
import { beginnerGlossary } from '../utils/cityNarrative';

const icons = [Leaf, Hammer, Droplets, Smile, Building2, MapPinned];

export default function BeginnerGuidePanel() {
  return (
    <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
      <div className="text-xs uppercase tracking-[0.28em] text-cyan-300">For Beginners</div>
      <h2 className="mt-2 text-xl font-bold text-white">看不懂《文明 VI》也能理解</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        这个系统模拟的是玩家在地图上选择新城市位置。一个好位置通常要能长人口、造东西、有资源、好防守，并且后续能放功能区。
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {beginnerGlossary.map((item, index) => {
          const Icon = icons[index];
          return (
            <div key={item.label} className="rounded-lg border border-slate-700 bg-gray-900 p-3">
              <div className="flex items-center gap-2 font-bold text-cyan-100">
                <Icon className="h-4 w-4 text-cyan-300" />
                {item.label}
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
