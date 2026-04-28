import { Gem } from 'lucide-react';
import { getResourceAssets } from '../utils/civ6VisualAssets';

interface ResourceIconListProps {
  title: string;
  resources: string[];
}

export default function ResourceIconList({ title, resources }: ResourceIconListProps) {
  const assets = getResourceAssets(resources);

  return (
    <div className="rounded-xl border border-slate-700 bg-gray-900 p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-white">
        <Gem className="h-4 w-4 text-cyan-300" />
        {title}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {assets.length > 0 ? (
          assets.map((asset) => (
            <div key={asset.label} className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-slate-950 px-2 py-1.5">
              <img src={asset.src} alt={asset.label} className="h-7 w-7 object-contain" />
              <span className="text-xs font-semibold text-cyan-50">{asset.label}</span>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500">暂无</div>
        )}
      </div>
    </div>
  );
}
