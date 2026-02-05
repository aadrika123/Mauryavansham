'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function SessionTimeout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(
        () => {
          signOut({ callbackUrl: '/sign-in' }); // auto logout
        },
        20 * 60 * 1000
      ); // 20 minutes
    };

    // Track user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer(); // start timer when component mounts

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, []);

  return <>{children}</>;
}
