import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  username: varchar("username", { length: 32 })
    .notNull()
    .unique(),

  country: varchar("country", { length: 2 }).notNull(), // TR, US
  language: varchar("language", { length: 5 }).notNull(), // tr, en
  // scores tablosuna bunu ekle:
  difficulty: varchar("difficulty", { length: 16 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scores = pgTable("scores", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
// scores tablosuna bunu ekle:
  difficulty: varchar("difficulty", { length: 16 }),
  mode: varchar("mode", { length: 16 }).notNull(), // typing | game
  score: integer("score").notNull(),
  wpm: integer("wpm"),
  accuracy: integer("accuracy"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
