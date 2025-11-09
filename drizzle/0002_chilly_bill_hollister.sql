CREATE TABLE `coupon_codes` (
	`code` text PRIMARY KEY NOT NULL,
	`used` integer DEFAULT false NOT NULL,
	`used_by` text,
	`used_at` integer,
	`plan_granted` text DEFAULT 'lifetime_free' NOT NULL
);
