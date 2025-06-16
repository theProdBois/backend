CREATE TABLE "developers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255),
	"website" varchar(500),
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "developers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"icon_url" varchar(500),
	"sort_order" integer DEFAULT 0,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "app_screenshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" uuid NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"sort_order" integer DEFAULT 0,
	"alt_text" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "apps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"package_name" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_description" varchar(160),
	"full_description" text,
	"developer_id" uuid NOT NULL,
	"developer_name" varchar(255) NOT NULL,
	"category_id" uuid NOT NULL,
	"tags" jsonb,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"moderation_notes" text,
	"content_rating" varchar(20) DEFAULT 'Everyone',
	"privacy_policy_url" varchar(500),
	"download_count" integer DEFAULT 0,
	"rating" numeric(3, 2) DEFAULT '0.00',
	"review_count" integer DEFAULT 0,
	"icon_url" varchar(500),
	"feature_graphic_url" varchar(500),
	"screenshots" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	"last_modified_at" timestamp DEFAULT now(),
	CONSTRAINT "apps_package_name_unique" UNIQUE("package_name")
);
--> statement-breakpoint
CREATE TABLE "app_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" uuid NOT NULL,
	"version_name" varchar(50) NOT NULL,
	"version_code" integer NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_path" varchar(500) NOT NULL,
	"file_size" integer NOT NULL,
	"file_hash" varchar(64) NOT NULL,
	"mime_type" varchar(100) DEFAULT 'application/vnd.android.package-archive',
	"min_sdk_version" integer,
	"target_sdk_version" integer,
	"supported_abis" jsonb,
	"permissions" jsonb,
	"release_notes" text,
	"release_notes_language" varchar(10) DEFAULT 'en',
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"rollout_percentage" integer DEFAULT 100,
	"download_count" integer DEFAULT 0,
	"crash_rate" numeric(5, 4) DEFAULT '0.0000',
	"created_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	"archived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(100),
	"comment" text,
	"app_version_code" integer,
	"device_model" varchar(100),
	"android_version" varchar(20),
	"is_moderated" boolean DEFAULT false,
	"is_helpful" boolean DEFAULT true,
	"helpful_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "downloads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" uuid NOT NULL,
	"version_id" uuid NOT NULL,
	"user_id" uuid,
	"ip_address" varchar(45),
	"user_agent" varchar(500),
	"country" varchar(2),
	"device_type" varchar(50),
	"status" varchar(20) DEFAULT 'completed',
	"downloaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "app_screenshots" ADD CONSTRAINT "app_screenshots_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apps" ADD CONSTRAINT "apps_developer_id_developers_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."developers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apps" ADD CONSTRAINT "apps_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_versions" ADD CONSTRAINT "app_versions_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_version_id_app_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."app_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "package_name_idx" ON "apps" USING btree ("package_name");--> statement-breakpoint
CREATE INDEX "developer_idx" ON "apps" USING btree ("developer_id");--> statement-breakpoint
CREATE INDEX "category_idx" ON "apps" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "status_idx" ON "apps" USING btree ("status");--> statement-breakpoint
CREATE INDEX "rating_idx" ON "apps" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "published_at_idx" ON "apps" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "app_version_idx" ON "app_versions" USING btree ("app_id","version_code");--> statement-breakpoint
CREATE INDEX "app_status_idx" ON "app_versions" USING btree ("app_id","status");--> statement-breakpoint
CREATE INDEX "version_published_at_idx" ON "app_versions" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "app_rating_idx" ON "reviews" USING btree ("app_id","rating");--> statement-breakpoint
CREATE INDEX "user_app_idx" ON "reviews" USING btree ("user_id","app_id");--> statement-breakpoint
CREATE INDEX "review_created_at_idx" ON "reviews" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "app_download_idx" ON "downloads" USING btree ("app_id","downloaded_at");--> statement-breakpoint
CREATE INDEX "user_download_idx" ON "downloads" USING btree ("user_id","downloaded_at");--> statement-breakpoint
CREATE INDEX "country_idx" ON "downloads" USING btree ("country");--> statement-breakpoint
DROP TYPE "public"."gender";