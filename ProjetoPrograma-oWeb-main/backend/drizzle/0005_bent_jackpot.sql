ALTER TABLE `appointments` ADD `cancellation_reason` text;--> statement-breakpoint
ALTER TABLE `appointments` ADD `completed_at` text;--> statement-breakpoint
ALTER TABLE `transactions` ADD `status` text DEFAULT 'liberado' NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` ADD `cancellation_reason` text;