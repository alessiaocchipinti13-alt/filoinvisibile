import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Ogni riga è un filo teso sul telaio: un gruppo d'età (a sinistra)
 * legato a una radice (a destra).
 */
export const threads = pgTable(
  "threads",
  {
    id: serial().primaryKey(),
    ageGroup: text("age_group").notNull(),
    category: text("category").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("threads_created_at_idx").on(table.createdAt)],
);
