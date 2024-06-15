alter table "public"."business_categories" drop constraint "business_categories_pkey";
alter table "public"."business_categories"
    add constraint "business_categories_pkey"
    primary key ("business_id", "category_id");
