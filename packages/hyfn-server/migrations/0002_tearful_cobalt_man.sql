ALTER TABLE "orders" ALTER COLUMN "service_fee" SET NOT NULL;
ALTER TABLE "orders" ALTER COLUMN "order_type" SET NOT NULL;
ALTER TABLE "products" DROP COLUMN IF EXISTS "currency";
ALTER TABLE "products" DROP COLUMN IF EXISTS "city";
ALTER TABLE "stores" DROP COLUMN IF EXISTS "currency";
ALTER TABLE "order_products" DROP COLUMN IF EXISTS "currency";
ALTER TABLE "order_products" DROP COLUMN IF EXISTS "city";