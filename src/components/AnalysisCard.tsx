import { CheckCircle2, XCircle } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  items: string[];
  type: 'advantage' | 'risk';
}

export default function AnalysisCard({ title, items, type }: AnalysisCardProps) {
  const isAdvantage = type === 'advantage';
  const Icon = isAdvantage ? CheckCircle2 : XCircle;

  return (
    <section
      className={`rounded-xl border p-5 shadow-lg transition-all hover:scale-[1.02] ${
        isAdvantage
          ? 'border-green-500/25 bg-green-950/30 shadow-green-950/30'
          : 'border-red-500/25 bg-red-950/30 shadow-red-950/30'
      }`}
    >
      <h2 className={`flex items-center gap-2 text-lg font-bold ${isAdvantage ? 'text-green-300' : 'text-red-300'}`}>
        <Icon className="h-5 w-5" />
        {title}
      </h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item} className={`border-l pl-3 ${isAdvantage ? 'border-green-400/40' : 'border-red-400/40'}`}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
