alter table "public"."locations" alter column "region" drop not null;
alter table "public"."locations" add column "region" name;
