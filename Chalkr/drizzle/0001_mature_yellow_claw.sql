CREATE TABLE `boulder_problems_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`grade` integer,
	`area` text,
	`description` text,
	`photo_url` text,
	`style` integer,
	FOREIGN KEY (`style`) REFERENCES `boulder_styles_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `boulder_styles_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `boulder_styles_table_name_unique` ON `boulder_styles_table` (`name`);--> statement-breakpoint
CREATE TABLE `workout_problems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer,
	`problem_id` integer,
	`sent` integer,
	`flash` integer,
	`attempts` integer,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`problem_id`) REFERENCES `boulder_problems_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workouts_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text DEFAULT (CURRENT_DATE),
	`timestamp` text DEFAULT CURRENT_TIMESTAMP,
	`notes` text,
	`climb_time` integer,
	`rest_time` integer,
	`warmup_time` integer
);
--> statement-breakpoint
ALTER TABLE `users_table` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `users_table` DROP COLUMN `age`;