CREATE TABLE `problem_hold_types` (
	`boulder_id` integer,
	`hold_type_id` integer,
	PRIMARY KEY(`boulder_id`, `hold_type_id`),
	FOREIGN KEY (`boulder_id`) REFERENCES `boulder_problems_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`hold_type_id`) REFERENCES `hold_types_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hold_types_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hold_types_table_name_unique` ON `hold_types_table` (`name`);