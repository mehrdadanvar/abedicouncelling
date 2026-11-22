CREATE TABLE `analytics_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`path` text NOT NULL,
	`kind` text,
	`referrer` text,
	`ip` text,
	`created_at` text NOT NULL,
	CONSTRAINT "analytics_click_kind" CHECK(("analytics_events"."type" <> 'click') = ("analytics_events"."kind" is null))
);
--> statement-breakpoint
CREATE INDEX `analytics_events_created_idx` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `analytics_events_page_idx` ON `analytics_events` (`type`,`path`);