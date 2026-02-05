'use client';

import type React from 'react';
import { ThemeProvider } from '@/src/components/theme-provider';
import { Toaster } from '@/src/components/ui/toaster';
import { Header } from '@/src/components/layout/header';
import { Footer } from '@/src/components/layout/footer';
import { ConditionalTopHeader } from '@/src/components/layout/conditionalTopHeader';
import { ToastProvider } from '@/src/components/ui/toastProvider';

export default function WebViewLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ConditionalTopHeader />
      <Header />
      <ToastProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </ToastProvider>
      <Footer />
    </>
  );
}
