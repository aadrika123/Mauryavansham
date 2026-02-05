// src/components/layout/ConditionalTopHeader.tsx
'use client';

import { usePathname } from 'next/navigation';
import { TopHeader } from './topBar';

export const ConditionalTopHeader = () => {
  const pathname = usePathname();

  // Show only on root or /home path
  if (pathname !== '/' && pathname !== '/home' && pathname == 'sign-in') return null;

  return <TopHeader />;
};
