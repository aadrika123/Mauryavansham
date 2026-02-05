'use client';

import { Crown } from 'lucide-react';

export default function Loader({ height = 450 }: { height?: number }) {
  return (
    <div className="w-full flex flex-col items-center justify-center relative" style={{ height }}>
      {/* Rotating Circle with Crown inside */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute w-28 h-28 border-t-8 border-red-600 rounded-full animate-spin"></div>
        <Crown className="w-10 h-10 text-red-600 z-10" />
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-red-700 font-medium text-lg text-center">Loading...</p>
    </div>
  );
}
