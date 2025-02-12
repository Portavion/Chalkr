PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ascents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`boulder_id` integer,
	`ascentTime` integer,
	`grade` integer,
	`isSuccess` integer,
	`style` text,
	FOREIGN KEY (`boulder_id`) REFERENCES `boulder_problems_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ascents`("id", "boulder_id", "ascentTime", "grade", "isSuccess", "style") SELECT "id", "boulder_id", "ascentTime", "grade", "isSuccess", "style" FROM `ascents`;--> statement-breakpoint
DROP TABLE `ascents`;--> statement-breakpoint
ALTER TABLE `__new_ascents` RENAME TO `ascents`;--> statement-breakpoint
PRAGMA foreign_keys=ON;