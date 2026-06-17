export default function TotalRevenueCard() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md/5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total revenue</p>
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <i className="ti ti-trending-up text-sm" />
        </div>
      </div>
      <p className="text-xl font-black text-slate-800">Rp 48,2jt</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          ↑ 12%
        </span>
        <span className="text-[10px] font-semibold text-slate-400">vs bulan lalu</span>
      </div>
      <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full w-[72%] bg-emerald-500 rounded-full" />
      </div>
    </div>
  );
}