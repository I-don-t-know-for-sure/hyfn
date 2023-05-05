CREATE TABLE IF NOT EXISTS "driverManagements" (
	"_id" serial PRIMARY KEY NOT NULL,
	"managementName" varchar,
	"managementPhone" varchar,
	"managementAddress" varchar,
	"country" varchar,
	"userId" varchar,
	"usersIds" varchar[],
	"users" json,
	"verified" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "drivers" (
	"_id" serial PRIMARY KEY NOT NULL,
	"driverName" varchar,
	"driverPhone" varchar,
	"tarnsportationMethod" varchar,
	"userId" varchar,
	"verified" boolean DEFAULT false,
	"balance" numeric,
	"driverManagement" varchar,
	"notificationToken" varchar[],
	"usedBalance" numeric
);

CREATE TABLE IF NOT EXISTS "users" (
	"_id" serial PRIMARY KEY NOT NULL,
	"userId" varchar,
	"name" varchar,
	"notificationTokens" varchar[],
	"orderId" varchar
);

CREATE TABLE IF NOT EXISTS "localCardKeys" (
	"_id" serial PRIMARY KEY NOT NULL,
	"TerminalId" varchar,
	"MerchantId" varchar,
	"secretKey" varchar,
	"inUse" boolean DEFAULT true,
	"storeId" varchar
);

CREATE TABLE IF NOT EXISTS "orders" (
	"_id" serial PRIMARY KEY NOT NULL,
	"userId" varchar,
	"storeId" varchar,
	"storeStatus" json,
	"customerStatus" json,
	"driverStatus" json,
	"StorePickupConfirmation" varchar,
	"paymentWindowCloseAt" date,
	"addedProducts" json[],
	"buyerCoords" numeric[],
	"city" varchar,
	"orderCost" numeric,
	"storeServiceFee" numeric,
	"deliveryFee" numeric,
	"orderDate" date DEFAULT now(),
	"deliveryDate" date DEFAULT now(),
	"serviceFee" numeric,
	"serviceFeePaid" boolean DEFAULT false,
	"orderType" varchar,
	"proposals" json[],
	"coords" json,
	"confirmationCode" varchar,
	"proposalsIds" varchar[],
	"acceptedProposal" varchar,
	"driverManagement" varchar,
	"managementFee" numeric
);

CREATE TABLE IF NOT EXISTS "products" (
	"_id" serial PRIMARY KEY NOT NULL,
	"textInfo" json,
	"pricing" json,
	"options" json[],
	"measurementSystem" varchar,
	"collections" json[],
	"collectionsIds" varchar[],
	"isActive" boolean DEFAULT false,
	"storeId" varchar,
	"images" varchar[],
	"city" varchar
);

CREATE TABLE IF NOT EXISTS "store" (
	"_id" serial PRIMARY KEY NOT NULL,
	"userId" varchar,
	"storeType" varchar,
	"storeName" varchar,
	"storePhone" varchar,
	"country" varchar,
	"city" varchar,
	"description" varchar,
	"address" varchar,
	"storeInfoFilled" boolean DEFAULT false,
	"currency" varchar,
	"usersIds" varchar[],
	"users" json,
	"storeDoc" json,
	"opened" boolean DEFAULT false,
	"balance" numeric(3, 2),
	"coords" json,
	"image" varchar[],
	"notificationToken" varchar[],
	"storeOwnerInfoFilled" boolean DEFAULT false,
	"ownerLastName" varchar,
	"ownerFirstName" varchar,
	"ownerPhoneNumber" varchar,
	"sadadFilled" boolean DEFAULT false,
	"localCardAPIKeyFilled" boolean DEFAULT false,
	"monthlySubscriptionPaid" boolean DEFAULT false,
	"subscriptionInfo" json,
	"localCardAPIKey" json,
	"acceptingOrders" boolean DEFAULT false,
	"collections" json[]
);

CREATE TABLE IF NOT EXISTS "transactions" (
	"_id" serial PRIMARY KEY NOT NULL,
	"customerId" varchar,
	"amount" numeric,
	"storeId" varchar,
	"transactionDate" date DEFAULT now(),
	"type" varchar,
	"validated" boolean DEFAULT false
);
