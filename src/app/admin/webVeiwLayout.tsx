'use client';
import type React from 'react';
import { ThemeProvider } from '@/src/components/theme-provider';
import { Toaster } from '@/src/components/ui/toaster';
import { ToastProvider } from '@/src/components/ui/toastProvider';

export default function Adminlayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {/* Wrap children in ToastProvider */}
      <ToastProvider>
        <Toaster /> {/* optional: your existing toaster */}
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
