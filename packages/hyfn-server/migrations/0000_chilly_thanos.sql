CREATE TABLE IF NOT EXISTS "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collection_type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"is_active" boolean DEFAULT false,
	"store_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "collections_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"collection_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"notification_tokens" varchar[] NOT NULL,
	"transaction_id" uuid,
	"addresses" jsonb[] NOT NULL,
	"reports_ids" uuid[] NOT NULL,
	"subscribed_to_hyfn_plus" boolean DEFAULT false,
	"expiration_date" timestamp
);

CREATE TABLE IF NOT EXISTS "driver_managements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"management_name" varchar NOT NULL,
	"management_phone" varchar NOT NULL,
	"management_address" varchar NOT NULL,
	"country" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	"users_ids" uuid[] NOT NULL,
	"users" jsonb[] NOT NULL,
	"verified" boolean DEFAULT false,
	"profits" numeric,
	"terminal_id" varchar,
	"merchant_id" varchar,
	"secure_key" varchar,
	"local_card_key_filled" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_name" varchar NOT NULL,
	"driver_phone" varchar NOT NULL,
	"tarnsportation_method" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"verified" boolean DEFAULT false,
	"balance" numeric NOT NULL,
	"driver_management" varchar,
	"notification_tokens" varchar[] NOT NULL,
	"used_balance" numeric NOT NULL,
	"reports_ids" uuid[] NOT NULL,
	"remove_driver_after_order" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "local_card_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"terminal_id" varchar NOT NULL,
	"merchant_id" varchar NOT NULL,
	"secret_key" varchar NOT NULL,
	"in_use" boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_status" varchar[] NOT NULL,
	"store_id" uuid NOT NULL,
	"driver_id" uuid,
	"customer_id" uuid NOT NULL,
	"customer_status" varchar[] NOT NULL,
	"driver_status" varchar[] NOT NULL,
	"store_pickup_confirmation" uuid DEFAULT gen_random_uuid(),
	"payment_window_close_at" timestamp,
	"customer_lat" numeric NOT NULL,
	"customer_long" numeric NOT NULL,
	"customer_address" varchar,
	"city" varchar,
	"order_cost" numeric NOT NULL,
	"store_service_fee" numeric NOT NULL,
	"delivery_fee" numeric NOT NULL,
	"order_date" timestamp DEFAULT now(),
	"delivery_date" timestamp DEFAULT now(),
	"service_fee" numeric,
	"service_fee_paid" boolean DEFAULT false,
	"order_type" varchar,
	"proposals" jsonb[] NOT NULL,
	"total_cost" numeric NOT NULL,
	"confirmation_code" uuid DEFAULT gen_random_uuid(),
	"proposals_ids" varchar[] NOT NULL,
	"accepted_proposal" varchar,
	"driver_management" varchar,
	"order_status" varchar[] NOT NULL,
	"reports_ids" uuid[] NOT NULL,
	"delivery_fee_paid" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"price" numeric NOT NULL,
	"currency" varchar NOT NULL,
	"prev_price" numeric NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"pricing" jsonb NOT NULL,
	"options" jsonb[] NOT NULL,
	"measurement_system" varchar NOT NULL,
	"white_background_images" varchar[] NOT NULL,
	"is_active" boolean DEFAULT false,
	"has_options" boolean DEFAULT false,
	"images" varchar[] NOT NULL,
	"city" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"store_type" varchar[] NOT NULL,
	"store_name" varchar NOT NULL,
	"store_phone" varchar NOT NULL,
	"country" varchar NOT NULL,
	"city" varchar NOT NULL,
	"description" varchar NOT NULL,
	"address" varchar NOT NULL,
	"store_info_filled" boolean DEFAULT false,
	"currency" varchar NOT NULL,
	"users_ids" uuid[] NOT NULL,
	"users" jsonb[] NOT NULL,
	"time_of_payment" timestamp,
	"expiration_date" timestamp,
	"number_of_months" numeric(3, 0),
	"lat" numeric NOT NULL,
	"long" numeric NOT NULL,
	"opened" boolean DEFAULT false,
	"balance" numeric NOT NULL,
	"image" varchar[] NOT NULL,
	"notification_tokens" varchar[] NOT NULL,
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
	"customer_id" varchar NOT NULL,
	"amount" numeric,
	"store_id" varchar NOT NULL,
	"transaction_date" timestamp DEFAULT now(),
	"type" varchar NOT NULL,
	"status" varchar[] NOT NULL,
	"transaction_method" varchar NOT NULL,
	"number_of_months" integer,
	"order_id" varchar
);

CREATE TABLE IF NOT EXISTS "local_card_key_store_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"local_card_key_id" uuid NOT NULL,
	"store_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "order_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" varchar NOT NULL,
	"price" numeric NOT NULL,
	"order_id" uuid NOT NULL,
	"currency" varchar NOT NULL,
	"prev_price" numeric NOT NULL,
	"title" varchar NOT NULL,
	"options" jsonb NOT NULL,
	"measurement_system" varchar,
	"has_options" boolean DEFAULT false NOT NULL,
	"pickup_status" varchar[] NOT NULL,
	"qty_found" numeric NOT NULL,
	"images" varchar[] NOT NULL,
	"city" varchar NOT NULL,
	"qty" numeric NOT NULL,
	"instructions" varchar
);

CREATE TABLE IF NOT EXISTS "product_descriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"description" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_date" timestamp DEFAULT now(),
	"order_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL
);
