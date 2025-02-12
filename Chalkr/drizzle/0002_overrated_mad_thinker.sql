CREATE TABLE `ascents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`boulder_id` integer,
	`ascentTime` integer,
	`grade` integer,
	`isSuccess` integer,
	`style` integer,
	FOREIGN KEY (`boulder_id`) REFERENCES `boulder_problems_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`style`) REFERENCES `boulder_styles_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout_ascent` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer,
	`ascent_id` integer,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ascent_id`) REFERENCES `ascents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `workouts_table` DROP COLUMN `notes`;