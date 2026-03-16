import React from 'react';

const Connecting = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Connecting...</h3>
          <p className="text-neutral-500 font-medium text-sm">Securing your conversation</p>
        </div>
      </div>
    </div>
  );
};

export default Connecting;
