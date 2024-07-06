import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
});

export const organisations = pgTable("organisations", {
  orgId: serial("orgId").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const usersRelation = relations(users, ({ many }) => ({
  organisations: many(organisations),
}));

export const organisationsRelation = relations(organisations, ({ many }) => ({
  users: many(users),
}));

export const usersToOrgs = pgTable(
  "users_to_organisations",
  {
    userId: integer("userId")
      .notNull()
      .references(() => users.id),
    orgId: integer("orgId")
      .notNull()
      .references(() => organisations.orgId),
  },
  (table) => ({ pk: [table.userId, table.orgId] }),
);

export const usersToOrgsRelations = relations(usersToOrgs, ({ one }) => ({
  organisation: one(organisations, {
    fields: [usersToOrgs.orgId],
    references: [organisations.orgId],
  }),
  user: one(users, {
    fields: [usersToOrgs.userId],
    references: [users.id],
  }),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertOrganisation = typeof organisations.$inferInsert;
export type SelectOrganisation = typeof organisations.$inferSelect;
