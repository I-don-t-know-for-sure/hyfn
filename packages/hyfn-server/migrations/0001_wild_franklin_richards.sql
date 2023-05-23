DROP TABLE local_card_key_store;
ALTER TABLE "orders" ALTER COLUMN "order_status" SET DATA TYPE varchar[];
ALTER TABLE "stores" ALTER COLUMN "balance" SET DATA TYPE numeric;
ALTER TABLE "transactions" ALTER COLUMN "status" SET DATA TYPE varchar[];