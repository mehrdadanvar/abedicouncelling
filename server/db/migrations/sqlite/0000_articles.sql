CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`draft` text,
	`published` text,
	`published_on` text,
	CONSTRAINT "article_has_content" CHECK("articles"."draft" is not null or "articles"."published" is not null),
	CONSTRAINT "article_publication_pair" CHECK(("articles"."published" is null) = ("articles"."published_on" is null))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);