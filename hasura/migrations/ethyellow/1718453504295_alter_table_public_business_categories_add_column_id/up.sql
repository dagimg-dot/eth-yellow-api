CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."business_categories" add column "id" uuid
 not null default gen_random_uuid();
