export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        
        {/* Simple spinner */}
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Simple text */}
        <p className="text-sm text-slate-500">Loading...</p>
        
      </div>
    </div>
  );
}