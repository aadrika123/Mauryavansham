'use client';

import type React from 'react';
import { ThemeProvider } from '@/src/components/theme-provider';
import { Toaster } from '@/src/components/ui/toaster';
import { Header } from '@/src/components/layout/header';
import { Footer } from '@/src/components/layout/footer';
import { ToastProvider } from '@/src/components/ui/toastProvider';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
}
