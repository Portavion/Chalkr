import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
});

export const workoutsTable = sqliteTable("workouts_table", {
  id: int().primaryKey({ autoIncrement: true }),
  date: text().default(sql`(CURRENT_DATE)`),
  timestamp: text().default(sql`CURRENT_TIMESTAMP`),
  notes: text(),
  climb_time: int(),
  rest_time: int(),
  warmup_time: int(),
});

export const boulderProblemsTable = sqliteTable("boulder_problems_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  grade: int(),
  area: text(),
  description: text(),
  photo_url: text(),
  style: int().references(() => boulderStylesTable.id),
});

export const workoutProblems = sqliteTable("workout_problems", {
  id: int().primaryKey({ autoIncrement: true }),
  workout_id: int().references(() => workoutsTable.id),
  problem_id: int().references(() => boulderProblemsTable.id),
  sent: int({ mode: "boolean" }),
  flash: int({ mode: "boolean" }),
  attempts: int(),
});

export const boulderStylesTable = sqliteTable("boulder_styles_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
});
