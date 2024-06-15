alter table "public"."business_categories" add constraint "business_categories_business_id_category_id_key" unique ("business_id", "category_id");
