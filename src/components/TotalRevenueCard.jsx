export default function TotalRevenueCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500">Total revenue</p>
        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
          <i className="ti ti-trending-up text-green-700 text-sm" />
        </div>
      </div>
      <p className="text-[22px] font-medium text-gray-900">Rp 48,2jt</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-800">
          <i className="ti ti-arrow-up text-[10px]" /> 12%
        </span>
        <span className="text-[11px] text-gray-400">vs bulan lalu</span>
      </div>
      <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full w-[72%] bg-green-500 rounded-full" />
      </div>
    </div>
  );
}