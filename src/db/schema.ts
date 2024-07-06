import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
});

export const orgsTable = pgTable("organisations", {
  orgId: serial("orgId").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertOrganisation = typeof orgsTable.$inferInsert;
export type SelectOrganisation = typeof orgsTable.$inferSelect;
