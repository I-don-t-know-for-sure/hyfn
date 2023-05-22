CREATE TABLE IF NOT EXISTS "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collection_type" varchar,
	"title" varchar,
	"description" varchar,
	"is_active" boolean DEFAULT false,
	"store_id" uuid
);

CREATE TABLE IF NOT EXISTS "collections_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"collection_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"name" varchar,
	"notification_tokens" varchar[],
	"transaction_id" uuid,
	"order_id" varchar,
	"addresses" jsonb[],
	"reports_ids" uuid[],
	"subscribed_to_hyfn_plus" boolean,
	"expiration_date" timestamp
);

CREATE TABLE IF NOT EXISTS "driver_managements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"management_name" varchar,
	"management_phone" varchar,
	"management_address" varchar,
	"country" varchar,
	"user_id" uuid,
	"users_ids" uuid[],
	"users" jsonb[],
	"verified" boolean DEFAULT false,
	"profits" numeric,
	"terminal_id" varchar,
	"merchant_id" varchar,
	"secure_key" varchar,
	"local_card_key_filled" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_name" varchar,
	"driver_phone" varchar,
	"tarnsportation_method" varchar,
	"user_id" varchar,
	"verified" boolean DEFAULT false,
	"balance" numeric,
	"driver_management" varchar,
	"notification_tokens" varchar[],
	"used_balance" numeric,
	"reports_ids" uuid[],
	"remove_driver_after_order" boolean
);

CREATE TABLE IF NOT EXISTS "local_card_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"terminal_id" varchar,
	"merchant_id" varchar,
	"secret_key" varchar,
	"in_use" boolean DEFAULT true,
	"store_id" varchar
);

CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_status" varchar[],
	"store_id" uuid,
	"driver_id" uuid,
	"customer_id" uuid,
	"customer_status" varchar[],
	"driver_status" varchar[],
	"store_pickup_confirmation" uuid DEFAULT gen_random_uuid(),
	"payment_window_close_at" timestamp,
	"customer_lat" numeric,
	"customer_long" numeric,
	"customer_address" varchar,
	"city" varchar,
	"order_cost" numeric,
	"store_service_fee" numeric,
	"delivery_fee" numeric,
	"order_date" timestamp DEFAULT now(),
	"delivery_date" timestamp DEFAULT now(),
	"service_fee" numeric,
	"service_fee_paid" boolean DEFAULT false,
	"order_type" varchar,
	"proposals" jsonb[],
	"total_cost" numeric,
	"confirmation_code" uuid DEFAULT gen_random_uuid(),
	"proposals_ids" varchar[],
	"accepted_proposal" varchar,
	"driver_management" varchar,
	"order_status" varchar,
	"reports_ids" uuid[],
	"delivery_fee_paid" boolean
);

CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid,
	"price" numeric,
	"currency" varchar,
	"prev_price" numeric,
	"title" varchar,
	"description" varchar,
	"pricing" jsonb,
	"options" jsonb[],
	"measurement_system" varchar,
	"white_background_images" varchar[],
	"is_active" boolean DEFAULT false,
	"has_options" boolean DEFAULT false,
	"images" varchar[],
	"city" varchar
);

CREATE TABLE IF NOT EXISTS "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"store_type" varchar[],
	"store_name" varchar,
	"store_phone" varchar,
	"country" varchar,
	"city" varchar,
	"description" varchar,
	"address" varchar,
	"store_info_filled" boolean DEFAULT false,
	"currency" varchar,
	"users_ids" uuid[],
	"users" jsonb[],
	"time_of_payment" timestamp,
	"expiration_date" timestamp,
	"number_of_months" numeric(3, 0),
	"lat" numeric,
	"long" numeric,
	"opened" boolean DEFAULT false,
	"balance" numeric(3, 2),
	"image" varchar[],
	"notification_token" varchar[],
	"store_owner_info_filled" boolean DEFAULT false,
	"owner_last_name" varchar,
	"owner_first_name" varchar,
	"owner_phone_number" varchar,
	"sadad_filled" boolean DEFAULT false,
	"monthly_subscription_paid" boolean DEFAULT false,
	"local_card_api_key_id" uuid,
	"accepting_orders" boolean DEFAULT false,
	"include_local_card_fee_to_price" boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar,
	"amount" numeric,
	"store_id" varchar,
	"transaction_date" timestamp DEFAULT now(),
	"type" varchar,
	"status" varchar,
	"transaction_method" varchar,
	"number_of_months" integer,
	"order_id" varchar
);

CREATE TABLE IF NOT EXISTS "local_card_key_store" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"local_card_key" uuid,
	"in_use" boolean DEFAULT true,
	"store_id" uuid
);

CREATE TABLE IF NOT EXISTS "local_card_key_store_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"local_card_key_id" uuid,
	"store_id" uuid
);

CREATE TABLE IF NOT EXISTS "order_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" varchar,
	"price" numeric,
	"order_id" uuid,
	"currency" varchar,
	"prev_price" numeric,
	"title" varchar,
	"options" jsonb,
	"measurement_system" varchar,
	"has_options" boolean DEFAULT false,
	"pickup_status" varchar[],
	"qty_found" numeric,
	"images" varchar[],
	"city" varchar,
	"qty" numeric,
	"instructions" varchar
);

CREATE TABLE IF NOT EXISTS "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_date" timestamp,
	"order_id" uuid,
	"driver_id" uuid
);
