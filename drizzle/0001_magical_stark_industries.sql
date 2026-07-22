ALTER TABLE `places` ADD `zone` text DEFAULT 'Kuta/Mandalika' NOT NULL;--> statement-breakpoint
ALTER TABLE `places` ADD `halal` text DEFAULT 'inconnu' NOT NULL;--> statement-breakpoint
ALTER TABLE `places` ADD `alcool_servi` integer;--> statement-breakpoint
ALTER TABLE `places` ADD `ambiance` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `places` ADD `mosquee_proche` text;--> statement-breakpoint
ALTER TABLE `places` ADD `prive` integer DEFAULT false NOT NULL;