CREATE TABLE `editions` (
	`id` text PRIMARY KEY NOT NULL,
	`release_date` integer NOT NULL,
	`edition_no` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `collections` ADD `edition_id` text REFERENCES editions(id);--> statement-breakpoint
CREATE UNIQUE INDEX `collections_edition_id_unique` ON `collections` (`edition_id`);