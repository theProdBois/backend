CREATE TYPE "public"."gender" AS ENUM('M', 'F', 'other');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(100) NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"phone" varchar(20),
	"date_of_birth" date,
	"gender" "gender",
	"city" varchar(100),
	"profile_picture_url" varchar(500),
	"is_active" boolean DEFAULT true,
	"email_verified" boolean DEFAULT false,
	"email_verified_at" timestamp,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
