import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

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

export const usersRelation = relations(usersTable, ({ many }) => ({
  organisations: many(orgsTable),
}));

export const organisationsRelation = relations(orgsTable, ({ many }) => ({
  users: many(usersTable),
}));

export const usersToOrgs = pgTable(
  "users_to_organisations",
  {
    userId: integer("userId")
      .notNull()
      .references(() => usersTable.id),
    orgId: integer("orgId")
      .notNull()
      .references(() => orgsTable.orgId),
  },
  (table) => ({ pk: [table.userId, table.orgId] }),
);

export const usersToOrgsRelations = relations(usersToOrgs, ({ one }) => ({
  group: one(orgsTable, {
    fields: [usersToOrgs.orgId],
    references: [orgsTable.orgId],
  }),
  user: one(usersTable, {
    fields: [usersToOrgs.userId],
    references: [usersTable.id],
  }),
}));

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertOrganisation = typeof orgsTable.$inferInsert;
export type SelectOrganisation = typeof orgsTable.$inferSelect;
