alter table "public"."contact" alter column "phone_number" drop not null;
alter table "public"."contact" add column "phone_number" int8;
