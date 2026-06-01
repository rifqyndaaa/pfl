const colors = {
  blue:   "bg-blue-50 text-blue-800",
  purple: "bg-purple-50 text-purple-800",
  green:  "bg-green-50 text-green-800",
  amber:  "bg-amber-50 text-amber-800",
};

export default function Avatar({ name, color = "blue", size = "md" }) {
  const initials = name.slice(0, 2).toUpperCase();
  const sz = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-[13px]";
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-medium ${colors[color]}`}>
      {initials}
    </div>
  );
}