export const chatBeforeInfo = "the following";
export const chatAfterInfo =
  'is product information. from the information I gave you, Give me a detailed description of this product. I want the answer straight and without filler words. for example the name of the product is simply "<NAME_OF_PRODUCT>" with <NAME_OF_PRODUCT> being the actual name of the product. write the result in html';
export const chatTranslateBefore = "translate the following";
export const chatTranslateAfter =
  'to arabic if its not already in arabic, if its already in arabic return "." and keep it in html';

export const hyfnPlusSubscriptionPrice = 10;

export const descriptionGenerationPricePerImage = 0.1;
export const backgroundRemovalPerImage = 0.1;

export const measurementSystem = [
  { label: "Kilo", value: "Kilo" },
  { label: "Liter", value: "Liter" },
  // { label: t("Gram"), value: "Gram" },
  // { label: t("Milliliter"), value: "Milliliter" },
  { label: "Unit", value: "Unit" },
];
export const test = "jcdnj";
export const test2 = "jcdnj";
export const test3 = "jcdnj";
export const test4 = "jcdnj";
export const ACTIVE_ORDERS = "activeOrders";
export const ACCEPTED_PROPOSALS_FLAG = "accepted";
export const ALL_PROPOSALS_FLAG = "all";
export const storeServiceFee = 0.0;
export const deliveryServiceFee = 0.0;
export const customerServiceFee = 0.03;
export const baseServiceFee = 2.5;

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

export const storeTypes = [
  { value: "restaurant", label: "Restaurant" },
  { value: "grocery", label: "Grocery" },
  { value: "clothes", label: "Clothes" },
  { value: "shoes", label: "Shoes" },
  { value: "stationery", label: "Stationery" },

  {
    value: "WJA",
    label: "Watches, jewlery, and accessories",
  },
  {
    value: "MCA",
    label: "Mother and child accessories",
  },
  {
    value: "CM",
    label: "Cleaning meterials",
  },
  { value: "games", label: "Games" },
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
];
// query keys
export const GET_DRIVER_INFO = "getDriverInfo";
export const paymentMethods = {
  sadad: "Sadad",
  localCard: "Local card",
};
export const paymentMethodsArray = [
  // {
  //   label: 'Sadad',
  //   value: 'sadad',
  // },
  {
    label: "Local card",
    value: "localCard",
  },
];

export const tarnsactionStatus = {
  paying: "Paying",
  paid: "Paid",
};

export const VERIFIED_DRIVER_AMOUNT = 750;
export const STORE_STATUS_PAID = "paid";
export const ORDER_STATUS_PREPARING = "preparing";
export const LOCAL_CARD_FEE = 0.03;
export const deliveryServiceFeeForStore = 0.1;
export const ORDER_STATUS_DELIVERED = "delivered";
export const ORDER_STATUS_PAID = "paid";
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

export const MINIMUM_AMOUNT_TO_CHECKOUT = 10;

// query keys

export const DRIVER_VERIFICATION = "driver-verification";

export const sadadTestPhoneNumber = "913301964";
export const sadadTestBirthYear = "1968";
export const sadadTestAmount = 10.24;
export const sadadCategoryNumber = 20;

export const PAYMENT_WINDOW = 10;
export const gibbrish = "gibbrish";
export const TRANSACTION_TYPE_SUBSCRIPTION = "SUBSCRIPTION";
export const TRANSACTION_TYPE_WALLET = "WALLET";

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

export const cities = {
  Libya: {
    Tripoli: "Tripoli",
    Ajdabiya: "Ajdabiya",
    Zuwara: "Zuwara",
    Yafran: "Yafran",
    Nalut: "Nalut",
    Gharyan: "Gharyan",
    "Al Bayda": "Al Bayda",
    "Bani Walid": "Bani Walid",
    "Al-Marj": "Al-Marj",
    Mizda: "Mizda",
    Benghazi: "Benghazi",
    Awbari: "Awbari",
    Tobruk: "Tobruk",
    "Al-Khums": "Al-Khums",
    Murzuk: "Murzuk",
    Shahat: "Shahat",
    Sabratah: "Sabratah",
    Ghat: "Ghat",
    Sirte: "Sirte",
    Tajura: "Tajura",
    Misrata: "Misrata",
    Zawiya: "Zawiya",
    Sabha: "Sabha",
    Brak: "Brak",
    Ghadamis: "Ghadamis",
    "Al Abyar": "Al Abyar",
    Tarhunah: "Tarhunah",
    Derna: "Derna",
    Waddan: "Waddan",
    Awjila: "Awjila",
    Suluq: "Suluq",
    Zelten: "Zelten",
    Qatrun: "Qatrun",
    "Al Qubbah": "Al Qubbah",
    Tocra: "Tocra",
    Jalu: "Jalu",
    Zliten: "Zliten",
    "Al Jamīl": "Al Jamīl",
    Brega: "Brega",
    Farzougha: "Farzougha",
    Sorman: "Sorman",
    Msallata: "Msallata",
    Kikla: "Kikla",
  },
};

export const COLLECTION_TYPE_MANUAL = "manual";

export const countries = {
  Libya: "Libya",
};
///////////////////////////////////////////////////////// enums ////////////////////////////////////////////////////////////
export const collectionTypesArray = [COLLECTION_TYPE_MANUAL];
export const measurementSystemArray = ["Kilo", "Liter", "Unit"];
export const storeTypesArray = [
  "restaurant",
  "grocery",
  "clothes",
  "shoes",
  "stationery",
  "WJA", // WJA
  "MCA",
  "CM",
  "games",
];
export const countriesArray = ["Libya"];
export const citiesArray = [
  "Tripoli",
  "Ajdabiya",
  "Zuwara",
  "Yafran",
  "Nalut",
  "Gharyan",
  "Al Bayda",
  "Bani Walid",
  "Al-Marj",
  "Mizda",
  "Benghazi",
  "Awbari",
  "Tobruk",
  "Al-Khums",
  "Murzuk",
  "Shahat",
  "Sabratah",
  "Ghat",
  "Sirte",
  "Tajura",
  "Misrata",
  "Zawiya",
  "Sabha",
  "Brak",
  "Ghadamis",
  "Al Abyar",
  "Tarhunah",
  "Derna",
  "Waddan",
  "Awjila",
  "Suluq",
  "Zelten",
  "Qatrun",
  "Al Qubbah",
  "Tocra",
  "Jalu",
  "Zliten",
  "Al Jamīl",
  "Brega",
  "Farzougha",
  "Sorman",
  "Msallata",
  "Kikla",
];

export const currenciesArray = ["LYD"];

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
