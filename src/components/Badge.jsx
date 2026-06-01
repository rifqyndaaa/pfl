const styles = {
  success: "bg-green-50 text-green-800",
  warning: "bg-amber-50 text-amber-800",
  danger:  "bg-red-50 text-red-800",
};

export default function Badge({ children, type = "success" }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${styles[type]}`}>
      {children}
    </span>
  );
}