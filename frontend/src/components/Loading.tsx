const Loading = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
      <div className="flex flex-col items-center space-y-2">
        <span className="text-white text-base font-bold tracking-widest uppercase opacity-40 animate-pulse">
          Ping
        </span>
      </div>
    </div>
  );
};

export default Loading;