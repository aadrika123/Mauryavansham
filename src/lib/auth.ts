import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/src/drizzle/db"
// import { users } from "@/src/drizzle/schema/users"
import { users } from "@/src/drizzle/schema"
import { eq } from "drizzle-orm"

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // Add this line
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email),
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            photo: user.photo,
            profileId: user.profileId,
          } as any
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id
      token.email = user.email
      token.name = user.name
      token.role = user.role
      token.photo = user.photo 
      token.profileId = user.profileId
    }
    return token
  },
  async session({ session, token }) {
    if (token) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
        photo: token.photo as string,
        profileId: token.profileId as string,
      }
    }
    return session
  },
},

  pages: {
    signIn: "/auth/signin",
  },
}
