ALTER TABLE "driver_managements" ADD COLUMN "local_card_api_key_id" uuid;
ALTER TABLE "driver_managements" DROP COLUMN IF EXISTS "terminal_id";
ALTER TABLE "driver_managements" DROP COLUMN IF EXISTS "merchant_id";
ALTER TABLE "driver_managements" DROP COLUMN IF EXISTS "secure_key";
ALTER TABLE "driver_managements" DROP COLUMN IF EXISTS "local_card_key_filled";