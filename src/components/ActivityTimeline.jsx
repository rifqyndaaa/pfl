const items = [
  { icon: "ti-file-plus",    bg: "#E6F1FB", color: "#185FA5", title: "Order #123 dibuat",         time: "10 mnt lalu", tagBg: "#E6F1FB", tagColor: "#0C447C", tag: "Baru dibuat" },
  { icon: "ti-circle-check", bg: "#EAF3DE", color: "#3B6D11", title: "Pembayaran dikonfirmasi",    time: "20 mnt lalu", tagBg: "#EAF3DE", tagColor: "#27500A", tag: "Lunas" },
  { icon: "ti-truck",        bg: "#FAEEDA", color: "#854F0B", title: "Produk dikirim",             time: "1 jam lalu",  tagBg: "#FAEEDA", tagColor: "#633806", tag: "Dalam pengiriman" },
  { icon: "ti-trophy",       bg: "#EEEDFE", color: "#534AB7", title: "Pesanan selesai",            time: "2 jam lalu",  tagBg: "#EEEDFE", tagColor: "#3C3489", tag: "Selesai" },
];

const steps = [
  { icon: "ti-file-plus",    label: "Dibuat" },
  { icon: "ti-credit-card",  label: "Dibayar" },
  { icon: "ti-truck",        label: "Dikirim" },
  { icon: "ti-trophy",       label: "Selesai" },
];

export default function ActivityTimeline() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Activity timeline</p>
          <p className="text-xs text-gray-400 mt-0.5">Order #123 · Hari ini</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-800">
          <i className="ti ti-circle-check text-xs" /> Selesai
        </span>
      </div>

      {/* Stepper */}
      <div className="flex mb-5">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              {i > 0 && <div className="flex-1 h-0.5 bg-green-200" />}
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center z-10">
                <i className={`ti ${s.icon} text-white`} style={{ fontSize: 11 }} />
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-0.5 bg-green-200" />}
            </div>
            <span className="text-[10px] font-medium text-green-700">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: item.bg }}>
              <i className={`ti ${item.icon} text-base`} style={{ color: item.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <p className="text-[13px] font-medium text-gray-900">{item.title}</p>
                <span className="text-[11px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                  <i className="ti ti-clock" style={{ fontSize: 10 }} />{item.time}
                </span>
              </div>
              <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: item.tagBg, color: item.tagColor }}>
                {item.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}