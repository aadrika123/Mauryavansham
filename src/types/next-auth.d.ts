import type { DefaultSession } from 'next-auth';

export type UserRole = 'user' | 'admin' | 'superAdmin';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      profileId: string;
      photo?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    photo?: string;
    profileId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
  }
}
