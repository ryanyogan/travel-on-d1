CREATE TABLE `trip` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_details` text NOT NULL,
	`image_urls` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
