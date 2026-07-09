PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_articles` (
	`id` text PRIMARY KEY NOT NULL,
	`collection_id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`rendered_html` text NOT NULL,
	`plain_text` text NOT NULL,
	`published_at` integer NOT NULL,
	`show_date` integer,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_articles`("id", "collection_id", "slug", "title", "excerpt", "rendered_html", "plain_text", "published_at", "show_date", "updated_at") SELECT "id", "collection_id", "slug", "title", "excerpt", "rendered_html", "plain_text", "published_at", "show_date", "updated_at" FROM `articles`;--> statement-breakpoint
DROP TABLE `articles`;--> statement-breakpoint
ALTER TABLE `__new_articles` RENAME TO `articles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `articles_collection_slug_unique` ON `articles` (`collection_id`,`slug`);