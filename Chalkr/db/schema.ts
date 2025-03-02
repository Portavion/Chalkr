import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
});

export const workoutsTable = sqliteTable("workouts_table", {
  id: int().primaryKey({ autoIncrement: true }),
  date: text().default(sql`(CURRENT_DATE)`),
  timestamp: text().default(sql`CURRENT_TIMESTAMP`),
  climb_time: int(),
  rest_time: int(),
  warmup_time: int(),
});

export const workoutAscentTable = sqliteTable("workout_ascent", {
  id: int().primaryKey({ autoIncrement: true }),
  workout_id: int().references(() => workoutsTable.id),
  ascent_id: int().references(() => ascentsTable.id),
});

export const ascentsTable = sqliteTable("ascents", {
  id: int().primaryKey({ autoIncrement: true }),
  route_id: int().references(() => routesTable.id),
  ascentTime: int(),
  restTime: int(),
  isSuccess: int({ mode: "boolean" }),
});

export const routesTable = sqliteTable("routes_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  grade: int(),
  area: text(),
  description: text(),
  photo_url: text(),
  thumbnail_url: text(),
  style: text(),
  color: text(),
});

export const holdTypesTable = sqliteTable("hold_types_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
});

export const routesHoldTypesTable = sqliteTable(
  "route_hold_types",
  {
    route_id: int().references(() => routesTable.id),
    hold_type: text(),
  },
  (t) => [primaryKey({ columns: [t.route_id, t.hold_type] })],
);
