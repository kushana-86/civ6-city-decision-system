import { ChevronRight, Droplets, Hammer, Home, Leaf, Shield } from 'lucide-react';
import type { CityCandidate } from '../data/cities';
import { calculateCityScore } from '../utils/calculateCityScore';

interface CityCardProps {
  city: CityCandidate;
  onOpen: (id: string) => void;
}

export default function CityCard({ city, onOpen }: CityCardProps) {
  const score = calculateCityScore(city);

  return (
    <button
      type="button"
      onClick={() => onOpen(city.id)}
      className="w-full rounded-xl border border-cyan-500/20 bg-slate-900 p-5 text-left shadow-lg transition-all hover:scale-[1.02] hover:border-cyan-400/50"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-white">{city.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{city.terrain}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-green-400">{score.total}</span>
          <ChevronRight className="h-5 w-5 text-cyan-200" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-5">
        <div className="flex items-center gap-2 text-slate-300"><Droplets className="h-4 w-4 text-cyan-300" />{city.waterSource}</div>
        <div className="flex items-center gap-2 text-slate-300"><Leaf className="h-4 w-4 text-green-300" />粮食 {city.food}</div>
        <div className="flex items-center gap-2 text-slate-300"><Hammer className="h-4 w-4 text-amber-300" />产能 {city.production}</div>
        <div className="flex items-center gap-2 text-slate-300"><Home className="h-4 w-4 text-sky-300" />住房 {city.housingPotential}</div>
        <div className="flex items-center gap-2 text-slate-300"><Shield className="h-4 w-4 text-blue-300" />防御 {city.defense}</div>
      </div>
    </button>
  );
}
