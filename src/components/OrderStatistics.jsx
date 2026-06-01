export default function OrderStatistics() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500">Order statistik</p>
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
          <i className="ti ti-shopping-cart text-blue-700 text-sm" />
        </div>
      </div>
      <p className="text-[22px] font-medium text-gray-900">1.284</p>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-lg font-medium text-gray-900">847</p>
          <p className="text-[10px] text-gray-400">Selesai</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-lg font-medium text-amber-700">437</p>
          <p className="text-[10px] text-gray-400">Pending</p>
        </div>
      </div>
    </div>
  );
}