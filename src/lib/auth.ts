import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/src/drizzle/db";
import { users } from "@/src/drizzle/schema";
import { userApprovals } from "@/src/drizzle/db/schemas/user_approvals";
import { eq } from "drizzle-orm";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please fill in both email and password");
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email.toLowerCase()),
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (user.isActive === false) {
          throw new Error(
            "Your account has been suspended due to violation of community guidelines."
          );
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // 🚨 Only for normal users
        if (user.role === "user") {
          const approvals = await db.query.userApprovals.findMany({
            where: eq(userApprovals.userId, user.id),
            with: { admin: true },
          });

          const approved = approvals.filter((a) => a.status === "approved");
          const rejected = approvals.filter((a) => a.status === "rejected");

          const approvedCount = approved.length;
          const requiredApprovals = 3;

          const approvedByNames = approved.map(
            (a) => a.admin?.name || a.adminName || "Unknown"
          );

          if (rejected.length > 0 || user.status === "rejected") {
            const rejectedBy = rejected.map(
              (a) =>
                `${a.admin?.name || a.adminName || "Unknown"} (${
                  a.reason || "No reason provided"
                })`
            );

            throw new Error(
              `Your account was rejected by admin: ${rejectedBy.join(", ")}.`
            );
          }

          if (approvedCount < requiredApprovals) {
            throw new Error(
              `Your account is pending approval (${approvedCount}/${requiredApprovals}).` +
                (approvedByNames.length > 0
                  ? ` Approved by: ${approvedByNames.join(", ")}`
                  : "")
            );
          }
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          photo: user.photo || "/default-avatar.png",
          profileId: user.profileId,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.photo = user.photo || "/default-avatar.png";
        token.profileId = user.profileId;
      }
      return token;
    },

    // ✅ Always fetch latest user from DB
    async session({ session, token }) {
      if (token?.id) {
        const freshUser = await db.query.users.findFirst({
          where: eq(users.id, Number(token.id)),
        });

        if (freshUser) {
          session.user = {
            id: freshUser.id.toString(),
            email: freshUser.email,
            name: freshUser.name,
            role: freshUser.role ?? "user", // fallback if null
            photo: freshUser.photo || "/default-avatar.png",
            profileId: freshUser.profileId?.toString() || "", // convert number → string
          };
        }
      }
      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
};
