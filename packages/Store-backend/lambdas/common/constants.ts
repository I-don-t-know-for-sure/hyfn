export const storeServiceFee = 0.01;
export const deliveryServiceFee = 0.15;
export const customerServiceFee = 0.02;

export const storeAndCustomerServiceFee = storeServiceFee + customerServiceFee;
export const currencies = { Libya: 'LYD' };

export const USER_TYPE_CUSTOMER = 'customer';
export const USER_TYPE_STORE = 'store';
export const USER_TYPE_DRIVER = 'driver';
export const sadadTestPhoneNumber = '913301964';
export const sadadTestBirthYear = '1968';
export const sadadTestAmount = 10.24;
export const sadadCategoryNumber = 20;
export const adminName = 'Hyfn';
export const transactionApproved = 'Approved';
export const subscriptionCost = 50;
export const PAYMENT_WINDOW = 30;
export const gibbrish = 'gibbrish';
export const TRANSACTION_TYPE_SUBSCRIPTION = 'SUBSCRIPTION';
export const TRANSACTION_TYPE_WALLET = 'WALLET';
export const ORDER_TYPE_DELIVERY = 'Delivery';
export const ORDER_TYPE_PICKUP = 'Pickup';
export const ORDER_STATUS_PREPARING = 'preparing';
export const ORDER_STATUS_ACCEPTED = 'accepted';
export const ORDER_STATUS_READY = 'ready';
export const DRIVER_STATUS_NOT_SET = 'not set';
export const trustedStores = [];
export const numberOfDriversAllowedToTrustForTrustedStores = 20;
export const NUMBER_OF_DRIVER_TO_TRUST = 1;
export const STORE_TYPE_RESTAURANT = 'restaurant';
export const ORDER_STATUS_DELIVERED = 'delivered';
export const STORE_STATUS_PENDING = 'pending';
export const STORE_STATUS_ACCEPTED = 'accepted';
export const STORE_STATUS_PAID = 'paid';
export const STORE_STATUS_READY = 'ready';
export const STORE_STATUS_PREPARING = 'preparing';
export const FREE_Month = 1;
export const storeTypes = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'clothes', label: 'Clothes' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'stationery', label: 'Stationery' },
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
    value: 'watches, jewlery, and accessories',
    label: 'Watches, jewlery, and accessories',
  },
  {
    value: 'mother and child accessories',
    label: 'Mother and child accessories',
  },
  {
    value: 'cleaning meterials',
    label: 'Cleaning meterials',
  },
  { value: 'games', label: 'Games' },
];
