const styles = {
  default: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
  primary: "bg-primary text-white hover:bg-primary-hover border-transparent shadow-sm shadow-primary/10",
  success: "bg-emerald-50 border border-emerald-250 text-emerald-700 hover:bg-emerald-100/80",
  danger:  "bg-rose-50 border border-rose-250 text-rose-700 hover:bg-rose-100/80",
};

export default function Button({ children, type = "default", className = "", onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${styles[type]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}