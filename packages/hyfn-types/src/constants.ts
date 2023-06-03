export const hyfnPlusSubscriptionPrice = 10;

export const descriptionGenerationPricePerImage = 0.1;
export const backgroundRemovalPerImage = 0.1;
export const ORDER_STATUS_PICKED = "picked up";
export const TRANSACTION_TYPE_STORE = "store";
export const TRANSACTION_TYPE_ADMIN = "hyfn";
export const LOCAL_CARD_TRANSACTION_FLAG_STORE = "store";
export const LOCAL_CARD_TRANSACTION_FLAG_SERVICE_FEE = "serviceFee";
export const TRANSACTION_TYPE_DRIVER_MANAGMENT = "driverManagement";
export const TRANSACTION_TYPE_MANAGMENT = "driverManagement";
export const LOCAL_CARD_TRANSACTION_FLAG_DRIVER_MANAGEMENT = "management";
export const LOCAL_CARD_TRANSACTION_FLAG_MANAGEMENT = "management";

/// customer payment
// export const TRANSACTION_TYPE_SUBSCRIPTION = "storeSubsscription";
export const TRANSACTION_TYPE_WALLET = "storeWallet";
export const subscriptionPayment = "subscriptionPayment";
export const serviceFeePayment = "serviceFeePayment";
export const managementPayment = "managementPayment";
export const storePayment = "storePayment";

export const transactionTypesArray = [
  subscriptionPayment,
  serviceFeePayment,
  managementPayment,
  storePayment,
  TRANSACTION_TYPE_WALLET,
  // TRANSACTION_TYPE_SUBSCRIPTION,
] as const;

export const ACTIVE_ORDERS = "activeOrders";
export const ACCEPTED_PROPOSALS_FLAG = "accepted";
export const ALL_PROPOSALS_FLAG = "all";
export const storeServiceFee = 0.0;
export const deliveryServiceFee = 0.0;
export const customerServiceFee = 0.03;
export const baseServiceFee = 2.5;

export const monthlySubscriptionCost = 50;

export const storeInfo = "storeInfo";
export const customData = "customData";
export const collections = "collections";
export const collection = "collection";
export const collectionProducts = "collectionProducts";
export const collectionStoreFrontProducts = "collectionStoreFrontProducts";
export const allProductsForCollection = "allProductsForCollection";
export const search = "search";
export const USER_TYPE_CUSTOMER = "customer";
export const USER_TYPE_STORE = "store";
export const ORDER_TYPE_DELIVERY = "Delivery";
export const ORDER_TYPE_PICKUP = "Pickup";
export const USER_TYPE_DRIVER = "driver";
export const product = "product";
export const barcodeSearch = "barcodeSearch";
export const productsSearch = "productsSearch";
export const activeOrders = "activeOrders";
export const orderHistory = "orderHistory";
export const transactions = "transactions";
export const trustedDrivers = "trustedDrivers";
export const products = "products";
export const STORE_STATUS_PENDING = "pending";
export const STORE_STATUS_ACCEPTED = "accepted";
export const STORE_STATUS_READY = "ready";
export const ORDER_STATUS_READY = "ready";
export const STORE_STATUS_PREPARING = "preparing";
export const DRIVER_STATUS_PICKEDUP = "picked up";
export const GETCURRENTUSERINFO = "GETCURRENTUSERINFO";
export const USER_DOCUMENT = "userDocument";
export const USER_ID = "userID";
export const LOGGED_IN = "loggedIn";
export const STORE_TYPE_RESTAURANT = "restaurant";

// query keys
export const GET_DRIVER_INFO = "getDriverInfo";
export const paymentMethods = {
  sadad: "Sadad",
  localCard: "Local card",
};

export const tarnsactionStatus = {
  paying: "Paying",
  paid: "Paid",
};

export const VERIFIED_DRIVER_AMOUNT = 750;
export const STORE_STATUS_PAID = "paid";
export const ORDER_STATUS_PREPARING = "preparing";
export const ORDER_STATUS_PAID = "paid";
export const ORDER_STATUS_DELIVERED = "delivered";
export const ORDER_STATUS_PENDING = "pending";
export const LOCAL_CARD_FEE = 0.03;
export const deliveryServiceFeeForStore = 0.1;
export const storeAndCustomerServiceFee = storeServiceFee + customerServiceFee;
export const subscriptionCost = 50;
export const adminName = "Hyfn";
export const transactionApproved = "Approved";
export const balanceByDriver = "driver";
export const balanceByStore = "store";
export const DRIVER_STATUS_NOT_SET = "not set";

export const USER_STATUS_DELIVERED = "delivered";
// add a message and title field to all objects

export const driverDoc = "driverDoc";
export const activeOrder = "activeOrder";

export const orders = "Orders";

export const STORE_STATUS_NOT_SET = "not set";

export const USER_DATA = "customData";
export const COLLECTION = "collection";
export const STORES = "stores";
export const PRODUCT = "product";
export const STOREFRONT = "storeFront";

export const MINIMUM_AMOUNT_TO_CHECKOUT = 50;

// query keys

export const DRIVER_VERIFICATION = "driver-verification";

export const sadadTestPhoneNumber = "913301964";
export const sadadTestBirthYear = "1968";
export const sadadTestAmount = 10.24;
export const sadadCategoryNumber = 20;

export const PAYMENT_WINDOW = 10;
export const gibbrish = "gibbrish";

export const ORDER_STATUS_ACCEPTED = "accepted";

export const trustedStores = [];
export const numberOfDriversAllowedToTrustForTrustedStores = 20;
export const NUMBER_OF_DRIVER_TO_TRUST = 1;

export const FREE_Month = 1;

export const DRIVER_STATUS_DELIVERED = "delivered";
export const DRIVER_STATUS_IN_PROGRESS = "in progress";
export const DEFAULT_MANAGEMENT_CUT = 0.07;
export const MAXIMUM_MANAGEMENT_CUT = 1;

// query keys

export const COLLECTION_TYPE_MANUAL = "manual";

///////////////////////////////////////////////////////// enums ////////////////////////////////////////////////////////////
export const collectionTypesArray = [COLLECTION_TYPE_MANUAL];
export const measurementSystemArray = ["Kilo", "Liter", "Unit"] as const;

export const transactionMethods = ["localCard"] as const;

export const storeTypesArray = [
  "restaurant",
  "grocery",
  "clothes",
  "shoes",
  "stationery",
  "watches, jewlery, and accessories",
  "mother and child accessories",
  "cleaning meterials",
  "games",
  "bakery",
  "sweets",
  "meat store",
] as const;

export const userTypesArray = [
  USER_TYPE_CUSTOMER,
  USER_TYPE_STORE,
  USER_TYPE_DRIVER,
];

export const orderStatusArray = [
  ORDER_STATUS_PREPARING,
  ORDER_STATUS_DELIVERED,
  ORDER_STATUS_ACCEPTED,
  ORDER_STATUS_PAID,
];
//////////////////////////////////////////////////////////// enums /////////////////////////////////////////////////////////
