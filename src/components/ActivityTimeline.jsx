const items = [
  { icon: "ti-file-plus",    bg: "bg-primary-light", color: "text-primary", title: "Order #123 dibuat",         time: "10 mnt lalu", tagBg: "bg-primary-light/50", tagColor: "text-primary", tag: "Baru dibuat" },
  { icon: "ti-circle-check", bg: "bg-emerald-50", color: "text-emerald-700", title: "Pembayaran dikonfirmasi",    time: "20 mnt lalu", tagBg: "bg-emerald-50", tagColor: "text-emerald-700", tag: "Lunas" },
  { icon: "ti-truck",        bg: "bg-amber-50", color: "text-amber-700", title: "Produk dikirim",             time: "1 jam lalu",  tagBg: "bg-amber-50", tagColor: "text-amber-700", tag: "Dalam pengiriman" },
  { icon: "ti-trophy",       bg: "bg-purple-50", color: "text-purple-700", title: "Pesanan selesai",            time: "2 jam lalu",  tagBg: "bg-purple-50", tagColor: "text-purple-700", tag: "Selesai" },
];

const steps = [
  { icon: "ti-file-plus",    label: "Dibuat" },
  { icon: "ti-credit-card",  label: "Dibayar" },
  { icon: "ti-truck",        label: "Dikirim" },
  { icon: "ti-trophy",       label: "Selesai" },
];

export default function ActivityTimeline() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md/5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Activity Timeline</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Order #123 · Hari ini</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          <i className="ti ti-circle-check text-xs" /> Selesai
        </span>
      </div>

      {/* Stepper */}
      <div className="flex mb-5">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              {i > 0 && <div className="flex-1 h-0.5 bg-primary-light" />}
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10 shadow-[0_0_10px_rgba(43,127,255,0.2)]">
                <i className={`ti ${s.icon} text-white`} style={{ fontSize: 10 }} />
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-0.5 bg-primary-light" />}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-primary">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-3 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bg} ${item.color}`}>
              <i className={`ti ${item.icon} text-sm`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <p className="text-xs font-bold text-slate-800">{item.title}</p>
                <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
                  <i className="ti ti-clock" style={{ fontSize: 9 }} />{item.time}
                </span>
              </div>
              <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.tagBg} ${item.tagColor}`}>
                {item.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}