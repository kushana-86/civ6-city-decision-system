interface ScoreBarProps {
  label: string;
  value: number;
  max?: number;
  color?: 'green' | 'cyan' | 'blue' | 'amber' | 'red';
}

const colorClass = {
  green: 'bg-green-400',
  cyan: 'bg-cyan-400',
  blue: 'bg-blue-400',
  amber: 'bg-amber-400',
  red: 'bg-red-400',
};

export default function ScoreBar({ label, value, max = 10, color = 'green' }: ScoreBarProps) {
  const width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-200">{label}</span>
        <span className="font-semibold text-white">
          {value.toFixed(1)} / {max}
        </span>
      </div>
      <div className="h-2 w-full rounded bg-gray-700">
        <div className={`h-2 rounded shadow-[0_0_16px_rgba(74,222,128,0.45)] ${colorClass[color]}`} style={{ width }} />
      </div>
    </div>
  );
}
