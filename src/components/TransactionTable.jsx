const transactions = [
  { date: "01 Jun", desc: "Order #001 – Laptop Pro",    method: "Transfer", type: "income",  methodStyle: "bg-blue-50 text-blue-700 border-blue-100",   amount: "+Rp 12,5jt", amountStyle: "text-emerald-600" },
  { date: "01 Jun", desc: "Refund #004 – Monitor",     method: "Refund",   type: "expense", methodStyle: "bg-rose-50 text-rose-700 border-rose-100",     amount: "-Rp 4,2jt",  amountStyle: "text-rose-600" },
  { date: "31 Mei", desc: "Order #003 – Keyboard Mech", method: "QRIS",     type: "income",  methodStyle: "bg-emerald-50 text-emerald-700 border-emerald-100", amount: "+Rp 780rb",  amountStyle: "text-emerald-600" },
  { date: "30 Mei", desc: "Order #002 – Mouse Wireless",method: "COD",      type: "pending", methodStyle: "bg-amber-50 text-amber-700 border-amber-100", amount: "Rp 350rb",   amountStyle: "text-gray-500" },
];

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconIncome = () => (
  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12l7 7 7-7"/>
    </svg>
  </div>
);

const IconExpense = () => (
  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  </div>
);

const IconPending = () => (
  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
);

export default function TransactionTable() {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h3 className="text-base font-semibold text-gray-900 tracking-tight">Riwayat Transaksi</h3>
          <p className="text-xs text-gray-500 mt-0.5">Catatan arus kas masuk dan keluar</p>
        </div>
        <button className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Export
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-100">
              {["TANGGAL", "KETERANGAN", "METODE", "JUMLAH"].map((h, i) => (
                <th 
                  key={h} 
                  className={`text-[11px] font-bold text-gray-400 tracking-wider px-6 py-3.5 ${i === 3 ? "text-right" : "text-left"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t, i) => (
              <tr key={i} className="hover:bg-gray-50/80 transition-all duration-150 group">
                {/* Tanggal */}
                <td className="px-6 py-4 font-medium text-gray-400 group-hover:text-gray-600 transition-colors">{t.date}</td>
                
                {/* Keterangan + Dinamis Ikon Transaksi */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {t.type === "income" && <IconIncome />}
                    {t.type === "expense" && <IconExpense />}
                    {t.type === "pending" && <IconPending />}
                    <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{t.desc}</span>
                  </div>
                </td>
                
                {/* Metode Pembayaran */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${t.methodStyle}`}>
                    {t.method}
                  </span>
                </td>
                
                {/* Jumlah (Sisi Kanan) */}
                <td className={`px-6 py-4 font-semibold text-right ${t.amountStyle}`}>{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}