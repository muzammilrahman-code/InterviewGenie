CREATE TABLE "interviews" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"job_position" text NOT NULL,
	"job_description" text NOT NULL,
	"experience" text NOT NULL,
	"status" text DEFAULT 'not-started' NOT NULL,
	"questions" jsonb DEFAULT '[]'::jsonb,
	"answers" jsonb DEFAULT '[]'::jsonb,
	"feedback" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
