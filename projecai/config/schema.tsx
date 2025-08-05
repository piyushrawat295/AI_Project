import { integer, pgTable, varchar, text, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer()
});

export const sessionChatTable = pgTable("session_chat", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar({ length: 255 }).notNull(),
  notes: text(),
  selectedDoctor:json(),
  conversation: json(),
  report: json(),
  createdBy: varchar({ length: 255 }).references(() => usersTable.email),
  createdOn: varchar({ length: 100 }) // ideally use timestamp
});
