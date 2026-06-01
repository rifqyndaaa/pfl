const orders = [
  { id: "#001", name: "Budi",  initials: "BU", color: "blue",   product: "Laptop Pro",    total: "Rp 12,5jt", status: "success", label: "Selesai" },
  { id: "#002", name: "Siti",  initials: "SI", color: "purple", product: "Mouse Wireless", total: "Rp 350rb",  status: "warning", label: "Pending" },
  { id: "#003", name: "Andi",  initials: "AN", color: "green",  product: "Keyboard Mech", total: "Rp 780rb",  status: "success", label: "Selesai" },
  { id: "#004", name: "Rini",  initials: "RN", color: "amber",  product: 'Monitor 27"',   total: "Rp 4,2jt",  status: "danger",  label: "Ditolak" },
];

const badgeStyle = {
  success: "bg-green-50 text-green-800",
  warning: "bg-amber-50 text-amber-800",
  danger:  "bg-red-50 text-red-800",
};

const avatarStyle = {
  blue:   "bg-blue-50 text-blue-800",
  purple: "bg-purple-50 text-purple-800",
  green:  "bg-green-50 text-green-800",
  amber:  "bg-amber-50 text-amber-800",
};

export default function OrdersTable() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">Daftar pesanan</p>
        <span className="text-xs text-gray-400">{orders.length} pesanan</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["ID", "Pelanggan", "Produk", "Total", "Status"].map(h => (
              <th key={h} className="text-left text-[11px] font-medium text-gray-400 px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
              <td className="px-5 py-3 text-gray-400">{o.id}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${avatarStyle[o.color]}`}>
                    {o.initials}
                  </div>
                  <span className="text-gray-900">{o.name}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-gray-600">{o.product}</td>
              <td className="px-5 py-3 font-medium text-gray-900">{o.total}</td>
              <td className="px-5 py-3">
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${badgeStyle[o.status]}`}>
                  {o.label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}