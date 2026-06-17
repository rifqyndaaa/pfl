export default function Card({ children, className = "", ...props }) {
  const hasBg = className.includes("bg-");
  const hasBorder = className.includes("border-");
  const hasPadding = className.includes("p-") || className.includes("px-") || className.includes("py-");
  
  return (
    <div 
      className={`
        rounded-2xl transition-all duration-300 hover:-translate-y-0.5
        ${hasBg ? "" : "bg-white"}
        ${hasBorder ? "" : "border border-slate-200/80 hover:border-primary/20"}
        ${hasPadding ? "" : "p-5"}
        ${hasBg && className.includes("bg-gradient-to") ? "hover:shadow-lg hover:shadow-primary/10" : "hover:shadow-md hover:shadow-slate-100/80"}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}