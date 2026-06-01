const styles = {
  default: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
  success: "bg-green-50 border border-green-300 text-green-800 hover:bg-green-100",
  danger:  "bg-red-50 border border-red-300 text-red-800 hover:bg-red-100",
};

export default function Button({ children, type = "default", onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-1.5 rounded-lg transition-colors ${styles[type]}`}
    >
      {children}
    </button>
  );
}