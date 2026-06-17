export default function PercentageCard() {
  const pct = 62;
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md/5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Persentase</p>
        <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center text-primary">
          <i className="ti ti-chart-pie text-sm" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle
            cx="32" cy="32" r={r} fill="none"
            stroke="#2B7FFF" strokeWidth="8"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            transform="rotate(-90 32 32)"
          />
          <text x="32" y="36.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0F172A">
            {pct}%
          </text>
        </svg>
        <div className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-primary inline-block" />
            <span className="text-slate-500">Target tercapai</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-slate-200 inline-block" />
            <span className="text-slate-400">Sisa target</span>
          </div>
        </div>
      </div>
    </div>
  );
}