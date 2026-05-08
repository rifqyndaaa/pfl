export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-xl">
      
      {/* Glow Background */}
      <div className="absolute w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full animate-pulse"></div>

      <div className="relative flex flex-col items-center">

        {/* Loader Circle */}
        <div className="relative w-24 h-24 flex items-center justify-center">

          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-slate-200"></div>

          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"></div>

          {/* Inner soft ring */}
          <div className="absolute inset-3 rounded-full border border-emerald-200/40 animate-pulse"></div>

          {/* Core */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 shadow-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
          </div>

        </div>

        {/* Text */}
        <div className="mt-8 text-center">
          <h2 className="text-lg font-medium tracking-wide text-slate-700">
            Loading
            <span className="text-emerald-500">...</span>
          </h2>

          <p className="text-xs text-slate-400 mt-1 tracking-widest">
            Please wait a moment
          </p>
        </div>

      </div>
    </div>
  );
}