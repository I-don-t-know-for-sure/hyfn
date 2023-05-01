export const measurementSystem = [
  { label: "Kilo", value: "Kilo" },
  { label: "Liter", value: "Liter" },
  // { label: t("Gram"), value: "Gram" },
  // { label: t("Milliliter"), value: "Milliliter" },
  { label: "Unit", value: "Unit" },
];
export const ACTIVE_ORDERS = "activeOrders";

export const storeServiceFee = 0.01;
export const deliveryServiceFee = 0.15;
export const customerServiceFee = 0.02;

export const monthlySubscriptionCost = 50;
export const progressNotification = {
  autoClose: false,
  loading: true,
};

export const successNotification = {
  autoClose: true,
  loading: false,
  color: "green",
};

export const errorNotificatin = {
  autoClose: true,
  loading: false,
  color: "red",
};
export const currencies = { Libya: "LYD" };
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
export const STORE_STATUS_PREPARING = "preparing";
export const GETCURRENTUSERINFO = "GETCURRENTUSERINFO";
export const USER_DOCUMENT = "userDocument";
export const USER_ID = "userID";
export const LOGGED_IN = "loggedIn";
export const STORE_TYPE_RESTAURANT = "restaurant";
export const MAXIMUM_MANAGEMENT_CUT = 0.15;

export const storeTypes = [
  { value: "restaurant", label: "Restaurant" },
  { value: "grocery", label: "Grocery" },
  { value: "clothes", label: "Clothes" },
  { value: "shoes", label: "Shoes" },
  { value: "stationery", label: "Stationery" },
  // { value: 'electronics', label: 'Electronics' },
  // {
  //   value: 'repair and spare parts',
  //   label: 'Repair and spare parts',
  // },
  //   {
  //     value: "construction materials",
  //     label: t("Construction materials"),
  //   },
  // { value: 'furniture', label: 'Furniture' },

  {
    value: "watches, jewlery, and accessories",
    label: "Watches, jewlery, and accessories",
  },
  {
    value: "mother and child accessories",
    label: "Mother and child accessories",
  },
  {
    value: "cleaning meterials",
    label: "Cleaning meterials",
  },
  { value: "games", label: "Games" },
];

// query keys
export const GET_DRIVER_INFO = "getDriverInfo";
