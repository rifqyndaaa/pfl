const orders = [
  { 
    id: "#001", 
    name: "Budi",   
    initials: "BU", 
    color: "blue",   
    product: "Laptop Pro",     
    total: "Rp 12,5jt", 
    status: "success", 
    label: "Selesai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" // Foto asli
  },
  { 
    id: "#002", 
    name: "Siti",   
    initials: "SI", 
    color: "purple", 
    product: "Mouse Wireless", 
    total: "Rp 350rb",  
    status: "warning", 
    label: "Pending",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" // Foto asli
  },
  { 
    id: "#003", 
    name: "Andi",   
    initials: "AN", 
    color: "green",  
    product: "Keyboard Mech", 
    total: "Rp 780rb",  
    status: "success", 
    label: "Selesai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" // Foto asli
  },
  { 
    id: "#004", 
    name: "Rini",   
    initials: "RN", 
    color: "amber",  
    product: 'Monitor 27"',    
    total: "Rp 4,2jt",  
    status: "danger",  
    label: "Ditolak",
    avatar: "" // Sengaja dikosongkan untuk contoh kalau foto tidak ada/gagal load
  },
];

const badgeStyle = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  danger:  "bg-rose-50 text-rose-700 border-rose-100",
};

const badgeDot = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger:  "bg-rose-500",
};

const avatarStyle = {
  blue:   "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  green:  "bg-emerald-100 text-emerald-700",
  amber:  "bg-amber-100 text-amber-700",
};

export default function OrdersTable() {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h3 className="text-base font-semibold text-gray-900 tracking-tight">Daftar Pesanan</h3>
          <p className="text-xs text-gray-500 mt-0.5">Pantau dan kelola semua transaksi masuk</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200/60">
          {orders.length} Total
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-100">
              {["ID PESANAN", "PELANGGAN", "PRODUK", "TOTAL", "STATUS"].map(h => (
                <th key={h} className="text-[11px] font-bold text-gray-400 tracking-wider px-6 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50/80 transition-all duration-150 group">
                {/* ID */}
                <td className="px-6 py-4 font-medium text-gray-400 group-hover:text-gray-600 transition-colors">{o.id}</td>
                
                {/* Pelanggan dengan Foto Img Src */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {o.avatar ? (
                      <img 
                        src={o.avatar} 
                        alt={o.name} 
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider ring-2 ring-gray-50 ${avatarStyle[o.color]}`}>
                        {o.initials}
                      </div>
                    )}
                    <span className="font-medium text-gray-800 group-hover:text-gray-900">{o.name}</span>
                  </div>
                </td>
                
                {/* Produk */}
                <td className="px-6 py-4 text-gray-600">{o.product}</td>
                
                {/* Total */}
                <td className="px-6 py-4 font-semibold text-gray-900">{o.total}</td>
                
                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${badgeStyle[o.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badgeDot[o.status]}`} />
                    {o.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}