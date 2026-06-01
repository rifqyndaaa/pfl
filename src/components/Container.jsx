export default function Container({
  children,
  className = "",
}) {
  return (
    <div
      className={`container mx-auto px-4 py-8 ${className}`}
    >
      {children}
    </div>
  );
}