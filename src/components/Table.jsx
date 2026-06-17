export default function Table({ headers, children, className = "" }) {
  return (
    <div className="overflow-x-auto border border-slate-200/80 rounded-2xl bg-white shadow-sm">
      <table className={`buiq-table ${className}`}>
        <thead>
          <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-4 text-left font-bold text-[10px] tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}