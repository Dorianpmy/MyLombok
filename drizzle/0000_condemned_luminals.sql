CREATE TABLE `favorites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`device_id` text NOT NULL,
	`place_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `favorites_device_place_idx` ON `favorites` (`device_id`,`place_id`);--> statement-breakpoint
CREATE TABLE `places` (
	`id` text PRIMARY KEY NOT NULL,
	`region` text NOT NULL,
	`island` text NOT NULL,
	`city` text NOT NULL,
	`category` text NOT NULL,
	`subcategory` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`specialty` text,
	`tags` text NOT NULL,
	`price_level` integer,
	`price_range` text,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`opening_hours` text,
	`whatsapp` text,
	`maps_url` text NOT NULL,
	`photos` text NOT NULL,
	`tested_by_us` integer DEFAULT false NOT NULL,
	`rating` real,
	`best_time` text,
	`level` text,
	`vigilance` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `places_slug_unique` ON `places` (`slug`);