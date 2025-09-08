import { relations } from "drizzle-orm";
import { users } from "../schemas/users.schema";
import { accounts } from "../schemas/accounts.schema";
import { sessions } from "../schemas/sessions.schema";
import { userApprovals } from "../schemas/user_approvals";
// import { userApprovals } from "../schemas/userApprovals.schema";

// Users ke relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  approvals: many(userApprovals, { relationName: "userApprovals" }), // ✅ new
}));

// UserApprovals ke relations
export const userApprovalsRelations = relations(userApprovals, ({ one }) => ({
  user: one(users, {
    fields: [userApprovals.userId],
    references: [users.id],
    relationName: "userApprovals",
  }),
  admin: one(users, {
    fields: [userApprovals.adminId],
    references: [users.id],
    relationName: "admin",
  }),
}));
