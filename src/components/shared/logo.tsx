import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-white text-xl italic shadow-inner">
        O
      </div>
      <span className="text-xl font-bold tracking-tighter text-slate-900 italic">
        ORCHIDS
      </span>
    </div>
  );
};

export default Logo;
