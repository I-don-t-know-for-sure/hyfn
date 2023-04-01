export const paymentMethods = {
  sadad: "Sadad",
  localCard: "Local card",
};

export const tarnsactionStatus = {
  paying: "Paying",
  paid: "Paid",
};

export const storeServiceFee = 0.01;
export const deliveryServiceFee = 0.15;
export const customerServiceFee = 0.02;
export const STORE_STATUS_PENDING = "pending";
export const STORE_STATUS_ACCEPTED = "accepted";
export const STORE_STATUS_PAID = "paid";
export const STORE_STATUS_READY = "ready";
export const STORE_STATUS_PREPARING = "preparing";
export const storeAndCustomerServiceFee = storeServiceFee + customerServiceFee;
export const adminName = "Hyfn";
export const transactionApproved = "Approved";
export const ORDER_TYPE_DELIVERY = "Delivery";
export const ORDER_TYPE_PICKUP = "Pickup";
export const USER_TYPE_CUSTOMER = "customer";
export const USER_TYPE_STORE = "store";
export const USER_TYPE_DRIVER = "driver";
export const DRIVER_STATUS_NOT_SET = "not set";
export const STORE_TYPE_RESTAURANT = "restaurant";
export const ORDER_STATUS_PREPARING = "preparing";
export const ORDER_STATUS_READY = "ready";
export const STORE_STATUS_READY_FOR_PAYMENT = "ready for payment";
export const ORDER_STATUS_DELIVERED = "delivered";
export const USER_STATUS_DELIVERED = "delivered";
export const STORE_STATUS_NOT_SET = "not set";

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
