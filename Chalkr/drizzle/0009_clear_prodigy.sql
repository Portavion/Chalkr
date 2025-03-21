PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_problem_hold_types` (
	`boulder_id` integer,
	`hold_type` text,
	PRIMARY KEY(`boulder_id`, `hold_type`),
	FOREIGN KEY (`boulder_id`) REFERENCES `boulder_problems_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_problem_hold_types`("boulder_id", "hold_type") SELECT "boulder_id", "hold_type" FROM `problem_hold_types`;--> statement-breakpoint
DROP TABLE `problem_hold_types`;--> statement-breakpoint
ALTER TABLE `__new_problem_hold_types` RENAME TO `problem_hold_types`;--> statement-breakpoint
PRAGMA foreign_keys=ON;