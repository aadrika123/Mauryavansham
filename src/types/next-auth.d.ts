import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      profileId: string
      photo?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    photo?: string
    profileId: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
}
