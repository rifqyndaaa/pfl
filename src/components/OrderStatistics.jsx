export default function OrderStatistics() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md/5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order statistik</p>
        <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center text-primary">
          <i className="ti ti-shopping-cart text-sm" />
        </div>
      </div>
      <p className="text-xl font-black text-slate-800">1.284</p>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
          <p className="text-sm font-bold text-slate-800">847</p>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Selesai</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
          <p className="text-sm font-bold text-warning">437</p>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Pending</p>
        </div>
      </div>
    </div>
  );
}