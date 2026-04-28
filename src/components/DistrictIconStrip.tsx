import { Building2 } from 'lucide-react';
import { getDistrictAsset, type VisualAsset } from '../utils/civ6VisualAssets';

interface DistrictIconStripProps {
  title: string;
  districts: string[];
}

export default function DistrictIconStrip({ title, districts }: DistrictIconStripProps) {
  const assets = districts.map((item) => getDistrictAsset(item)).filter((asset): asset is VisualAsset => Boolean(asset));

  return (
    <div className="rounded-xl border border-slate-700 bg-gray-900 p-4">
      <h3 className="flex items-center gap-2 font-bold text-white">
        <Building2 className="h-5 w-5 text-cyan-300" />
        {title}
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {assets.map((asset) => (
          <div key={asset.label} className="rounded-lg border border-cyan-500/20 bg-slate-950 p-2">
            <img src={asset.src} alt={asset.label} className="mx-auto h-12 w-12 object-contain" />
            <div className="mt-1 text-center text-xs font-bold text-cyan-50">{asset.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
