const styles = {
  primary: "bg-primary-light text-primary border-primary/20",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  danger:  "bg-rose-50 text-rose-700 border-rose-100",
};

export default function Badge({ children, type = "success" }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${styles[type]}`}>
      {children}
    </span>
  );
}