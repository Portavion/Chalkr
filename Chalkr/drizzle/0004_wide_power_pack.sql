DROP TABLE `boulder_styles_table`;--> statement-breakpoint
DROP TABLE `workout_problems`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_boulder_problems_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`grade` integer,
	`area` text,
	`description` text,
	`photo_url` text,
	`style` text
);
--> statement-breakpoint
INSERT INTO `__new_boulder_problems_table`("id", "name", "grade", "area", "description", "photo_url", "style") SELECT "id", "name", "grade", "area", "description", "photo_url", "style" FROM `boulder_problems_table`;--> statement-breakpoint
DROP TABLE `boulder_problems_table`;--> statement-breakpoint
ALTER TABLE `__new_boulder_problems_table` RENAME TO `boulder_problems_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `ascents` ADD `restTime` integer;