import { PricePoint } from "@/lib/types";

export function PriceChart({ points }: { points: PricePoint[] }) {
  if (!points.length) {
    return <div className="text-sm text-muted">No pricing data available.</div>;
  }

  const prices = points.map((point) => point.close);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const polyline = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100;
      const y = 100 - ((point.close - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 100 100" className="h-52 w-full rounded-2xl bg-canvas p-4">
        <defs>
          <linearGradient id="line-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(94,234,212,0.55)" />
            <stop offset="100%" stopColor="rgba(94,234,212,0.05)" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,100 ${polyline} 100,100`}
          fill="url(#line-fill)"
          stroke="none"
        />
        <polyline
          points={polyline}
          fill="none"
          stroke="#5eead4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}
