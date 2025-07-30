import { relations } from "drizzle-orm";
import { users } from "../schemas/users.schema";
import { accounts } from "../schemas/accounts.schema";
import { sessions } from "../schemas/sessions.schema";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));
