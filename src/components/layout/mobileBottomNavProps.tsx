'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface MobileBottomNavProps {
  navItems: NavItem[];
}

export default function MobileBottomNav({ navItems }: MobileBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 shadow-2xl z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1 py-1 px-3 active:scale-95 transition-all"
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  isActive ? 'bg-gradient-to-r from-red-600 to-orange-500' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <span className={`text-xs ${isActive ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
