CREATE TABLE IF NOT EXISTS "users_to_organisations" (
	"userId" integer NOT NULL,
	"orgId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_organisations" ADD CONSTRAINT "users_to_organisations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_organisations" ADD CONSTRAINT "users_to_organisations_orgId_organisations_orgId_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organisations"("orgId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
