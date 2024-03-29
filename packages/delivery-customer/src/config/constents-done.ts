export const storeServiceFee = 0.01;
export const customerServiceFee = 0.02;

export const storeAndCustomerServiceFee = storeServiceFee + customerServiceFee;
export const currencies = { Libya: "LYD" };

export const USER_DOCUMENT = "userDocument";
export const USER_DATA = "customData";
export const COLLECTION = "collection";
export const STORES = "stores";
export const PRODUCT = "product";
export const STOREFRONT = "storeFront";
export const GETCURRENTUSERINFO = "GETCURRENTUSERINFO";
export const ORDER_TYPE_DELIVERY = "Delivery";
export const ORDER_TYPE_PICKUP = "Pickup";
export const USER_ID = "userID";
export const LOGGED_IN = "loggedIn";
export const STORE_TYPE_RESTAURANT = "restaurant";
export const ACTIVE_ORDERS = "activeOrders";
export const STORE_STATUS_PENDING = "pending";
export const STORE_STATUS_ACCEPTED = "accepted";
export const STORE_STATUS_READY = "ready";
export const STORE_STATUS_PREPARING = "preparing";
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
export const GET_DRIVER_INFO = "getDriverInfo";
export const MINIMUM_AMOUNT_TO_CHECKOUT = 50;

export const commonQuestions = [
  {
    question: "ما هي الخدمات التي نقدمها؟",
    answer:
      '<p style="text-align: right">ندير منصة للطلب والتوصيل عبر الانترنت عن طريق ثلاث تطبيقات</p><p style="text-align: right"> التطبيق الرئيسي</p><p style="text-align: right">يمكن هذا التطبيق المستخدِم من الشراء بالدينار الليبي عن طريق وسائل الدفع الالكتروني كل ما يعرض في التطبيق من منتجات</p><p style="text-align: right"> تطبيق السائق</p><p style="text-align: right">يوفر للسائق واجهة مستخدم للتعامل مع الطلبات و التواصل مع الزبائن</p><p style="text-align: right"> تطبيق التاجر</p><p style="text-align: right">يوفر للتاجر واجهة مستخدم سهلة الاستعمال لإدارة منتجاته على المنصة</p>',
  },
  {
    question: "هل الأسعار على منصتنا هي نفس الأسعار في المتجر؟",
    answer:
      '<p style="text-align: right">يتم تحديد أسعار المنتجات على المنصة من قبل المتاجر التي تبيعها</p>',
  },
  {
    question: "كم تكلفة الخدمات اللي تقدمها الشركة؟",
    answer:
      '<div dir="ltr"> <h3 style="text-align: right">تكلفة الخدمات للزبون</h3><p style="text-align: right">نحن نفرض رسوم خدمة بنسبة 2.5 دينار + 2% من كل طلب يتم إجراؤه من خلال منصتنا</p><p style="text-align: right" dir="ltr">مع العضوية الاختيارية، يمكنك الاستمتاع بإجراء الطلبات دون دفع رسوم الخدمة</p><h3 style="text-align: right">تكلفة الخدمات للتاجر</h3><p style="text-align: right">تكلفة الاشتراك الشهري لخدماتنا للتاجر 50 دينار</p></div>',
  },
];
