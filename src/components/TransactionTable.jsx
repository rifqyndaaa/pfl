const transactions = [
  { date: "01 Jun", desc: "Order #001 – Laptop Pro",    method: "Transfer", methodStyle: "bg-blue-50 text-blue-800",   amount: "+Rp 12,5jt", amountStyle: "text-green-700" },
  { date: "01 Jun", desc: "Refund #004 – Monitor",      method: "Refund",   methodStyle: "bg-red-50 text-red-800",     amount: "-Rp 4,2jt",  amountStyle: "text-red-700" },
  { date: "31 Mei", desc: "Order #003 – Keyboard Mech", method: "QRIS",     methodStyle: "bg-green-50 text-green-800", amount: "+Rp 780rb",  amountStyle: "text-green-700" },
  { date: "30 Mei", desc: "Order #002 – Mouse Wireless",method: "COD",      methodStyle: "bg-amber-50 text-amber-800", amount: "Rp 350rb",   amountStyle: "text-gray-500" },
];

export default function TransactionTable() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">Riwayat transaksi</p>
        <button className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          <i className="ti ti-download text-xs" /> Export
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Tanggal", "Keterangan", "Metode", "Jumlah"].map((h, i) => (
              <th key={h} className={`text-[11px] font-medium text-gray-400 px-5 py-3 ${i === 3 ? "text-right" : "text-left"}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{t.date}</td>
              <td className="px-5 py-3 text-gray-700">{t.desc}</td>
              <td className="px-5 py-3">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${t.methodStyle}`}>{t.method}</span>
              </td>
              <td className={`px-5 py-3 font-medium text-right ${t.amountStyle}`}>{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}