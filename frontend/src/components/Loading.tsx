interface LoadingProps {
  fullScreen?: boolean;
}

const Loading = ({ fullScreen = true }: LoadingProps) => {
  return (
    <div className={`
      ${fullScreen ? 'fixed inset-0 min-h-screen bg-[#050505]' : 'h-full w-full bg-transparent'} 
      flex flex-col items-center justify-center space-y-8 z-[9999] transition-all duration-500
    `}>
      {fullScreen && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:1s]" />
        </div>
      )}

      {/* Loader */}
      <div className="relative group scale-110 sm:scale-125">
        <div className="absolute inset-0 bg-indigo-500 blur-[40px] opacity-20 animate-pulse group-hover:opacity-40 transition-opacity" />
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[1.8rem] flex items-center justify-center p-[1px] shadow-2xl relative">
            <div className="w-full h-full bg-black rounded-[1.7rem] flex items-center justify-center p-4">
                <div className="w-full h-full border-2 border-white/5 border-t-white rounded-full animate-spin" />
            </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-1 relative z-10 text-center">
        <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tighter uppercase">
          Ping
        </h2>
        <div className="flex items-center gap-1.5 justify-center">
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
          </div>
          <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em]">
            Connecting
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;