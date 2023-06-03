ALTER TABLE "orders" ADD COLUMN "only_store_drivers_can_take_orders" boolean DEFAULT false NOT NULL;
ALTER TABLE "stores" ADD COLUMN "only_store_drivers_can_take_orders" boolean DEFAULT false;
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_only_store_drivers_can_take_orders_stores_id_only_store_drivers_can_take_orders_fk" FOREIGN KEY ("store_id","only_store_drivers_can_take_orders") REFERENCES "stores"("id","only_store_drivers_can_take_orders") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "only_store_drivers_can_take_orders" ON "orders" ("only_store_drivers_can_take_orders");