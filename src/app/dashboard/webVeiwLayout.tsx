'use client';
import type React from 'react';
import { ThemeProvider } from '@/src/components/theme-provider';
import { Toaster } from '@/src/components/ui/toaster';
import { ToastProvider } from '@/src/components/ui/toastProvider';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <ToastProvider>
        <Toaster />
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
