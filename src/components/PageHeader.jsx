export default function PageHeader({ title, breadcrumb, children }) {
  const renderBreadcrumb = () => {
    if (!breadcrumb) return null;
    if (typeof breadcrumb === "string") {
      return <p className="text-sm text-gray-400 mt-0.5">{breadcrumb}</p>;
    }
    if (Array.isArray(breadcrumb)) {
      return (
        <div className="flex items-center gap-1 text-sm text-gray-400 mt-0.5">
          {breadcrumb.map((item, idx) => (
            <span key={idx}>
              {item}
              {idx < breadcrumb.length - 1 && <span className="mx-1">/</span>}
            </span>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-start justify-between px-2 pb-4">
      <div>
        <span className="text-2xl font-bold text-gray-800">{title}</span>
        {renderBreadcrumb()}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}