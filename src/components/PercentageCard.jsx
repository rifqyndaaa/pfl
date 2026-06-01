export default function PercentageCard() {
  const pct = 62;
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500">Persentase</p>
        <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
          <i className="ti ti-chart-pie text-purple-700 text-sm" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
          <circle
            cx="32" cy="32" r={r} fill="none"
            stroke="#7c3aed" strokeWidth="8"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            transform="rotate(-90 32 32)"
          />
          <text x="32" y="36" textAnchor="middle" fontSize="13" fontWeight="500" fill="#111827">
            {pct}%
          </text>
        </svg>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-purple-600 inline-block" />
            <span className="text-xs text-gray-500">Target tercapai</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-gray-200 inline-block" />
            <span className="text-xs text-gray-500">Sisa target</span>
          </div>
        </div>
      </div>
    </div>
  );
}