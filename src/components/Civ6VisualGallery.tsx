import { Image } from 'lucide-react';
import type { VisualAsset } from '../utils/civ6VisualAssets';

interface Civ6VisualGalleryProps {
  title: string;
  subtitle?: string;
  assets: VisualAsset[];
  compact?: boolean;
}

export default function Civ6VisualGallery({ title, subtitle, assets, compact = false }: Civ6VisualGalleryProps) {
  return (
    <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Image className="h-5 w-5 text-cyan-300" />
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>}
        </div>
        <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">{assets.length} 张图</div>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-7'}`}>
        {assets.map((asset) => (
          <figure key={`${asset.label}-${asset.src}`} className="overflow-hidden rounded-xl border border-slate-700 bg-gray-900">
            <div className={compact ? 'aspect-square bg-slate-950 p-2' : 'aspect-[1.15] bg-slate-950 p-2'}>
              <img src={asset.src} alt={asset.label} className="h-full w-full object-contain" />
            </div>
            <figcaption className="border-t border-slate-700 px-2 py-2">
              <div className="text-sm font-bold text-white">{asset.label}</div>
              {asset.note && <div className="mt-1 text-xs leading-4 text-slate-500">{asset.note}</div>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
