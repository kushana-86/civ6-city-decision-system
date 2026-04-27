import type { LucideIcon } from 'lucide-react';

interface StatItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  tone?: 'cyan' | 'green' | 'red' | 'gold' | 'blue';
}

const toneClass = {
  cyan: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20',
  green: 'text-green-300 bg-green-400/10 border-green-400/20',
  red: 'text-red-300 bg-red-400/10 border-red-400/20',
  gold: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
  blue: 'text-blue-300 bg-blue-400/10 border-blue-400/20',
};

export default function StatItem({ icon: Icon, label, value, suffix, tone = 'cyan' }: StatItemProps) {
  return (
    <div className={`rounded-xl border p-4 shadow-lg transition-all hover:scale-105 ${toneClass[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-slate-300">{label}</span>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-3xl font-bold text-white">
        {value}
        {suffix && <span className="ml-1 text-base font-medium text-slate-400">{suffix}</span>}
      </div>
    </div>
  );
}
