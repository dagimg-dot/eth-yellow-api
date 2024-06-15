BEGIN TRANSACTION;
ALTER TABLE "public"."business_categories" DROP CONSTRAINT "business_categories_pkey";

ALTER TABLE "public"."business_categories"
    ADD CONSTRAINT "business_categories_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;
