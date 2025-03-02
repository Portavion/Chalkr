ALTER TABLE `problem_hold_types` RENAME TO `route_hold_types`;--> statement-breakpoint
ALTER TABLE `boulder_problems_table` RENAME TO `routes_table`;--> statement-breakpoint
ALTER TABLE `route_hold_types` RENAME COLUMN "boulder_id" TO "route_id";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_route_hold_types` (
	`route_id` integer,
	`hold_type` text,
	PRIMARY KEY(`route_id`, `hold_type`),
	FOREIGN KEY (`route_id`) REFERENCES `routes_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_route_hold_types`("route_id", "hold_type") SELECT "route_id", "hold_type" FROM `route_hold_types`;--> statement-breakpoint
DROP TABLE `route_hold_types`;--> statement-breakpoint
ALTER TABLE `__new_route_hold_types` RENAME TO `route_hold_types`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_ascents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`route_id` integer,
	`ascentTime` integer,
	`restTime` integer,
	`isSuccess` integer,
	FOREIGN KEY (`route_id`) REFERENCES `routes_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ascents`("id", "route_id", "ascentTime", "restTime", "isSuccess") SELECT "id", "boulder_id", "ascentTime", "restTime", "isSuccess" FROM `ascents`;--> statement-breakpoint
DROP TABLE `ascents`;--> statement-breakpoint
ALTER TABLE `__new_ascents` RENAME TO `ascents`;
