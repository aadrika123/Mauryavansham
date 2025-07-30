import { pgEnum } from "drizzle-orm/pg-core";

export const memberCategoryEnum = pgEnum("member_category", [
  "government",
  "private",
  "business",
  "student",
  "retired",
  "other",
]);
