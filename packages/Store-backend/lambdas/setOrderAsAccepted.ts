export const setOrderAsAcceptedHandler = async ({
  arg,
  db
}: SetOrderAsAcceptedProps) => {
  const { orderId, country, storeId } = arg[0];

  const orderDoc = await db
    .selectFrom("orders")
    .selectAll()
    .where("id", "=", orderId)
    .executeTakeFirstOrThrow();

  const products = await db
    .selectFrom("orderProducts")
    .selectAll()
    .where("orderId", "=", orderId)
    .execute();
  const storeDoc = await db
    .selectFrom("stores")
    .where("id", "=", orderDoc.storeId)
    .select(["storeType"])
    .executeTakeFirstOrThrow();
  if (orderDoc?.orderStatus?.includes("delivered")) {
    throw new Error(returnsObj["order is Delivered"]);
  }

  // const driverStatus = orderDoc.driverStatus;

  // if (!driverStatus.includes('set') && orderDoc.orderType === 'Delivery') {
  //   throw new Error(returnsObj['This order has no driver']);
  // }

  if (orderDoc.storeStatus.includes("accepted")) {
    throw new Error(returnsObj["already accepted"]);
  }
  const productNotPicked = products.find(
    (product) =>
      product?.pickupStatus[product?.pickupStatus.length - 1] === "initial"
  );
  if (productNotPicked) {
    throw new Error(returnsObj["one of the products not picked"]);
  }
  // if the order was canceled then we won't allow the driver to ask for payment
  if (orderDoc?.orderStatus?.includes("canceled")) {
    throw new Error(returnsObj["Order was canceled"]);
  }
  const now = new Date();
  now.setMinutes(now.getMinutes() + PAYMENT_WINDOW);

  /* if (orderDoc.orderType === 'Pickup' || orderDoc.storeId === orderDoc.driverManagement) {
    if (orderDoc.serviceFeePaid) {
      await db
        .updateTable('orders')
        .set({
          storeStatus: [
            ...orderDoc.storeStatus,
            'accepted',
            orderDoc.serviceFeePaid && storeDoc.storeType.includes('restaurant')
              ? 'preparing'
              : 'ready',
          ],

          paymentWindowCloseAt: now,
        })
        .where('id', '=', orderId)
        .executeTakeFirstOrThrow();
      // send notification to the driver to tell them that the order is ready for pickup
      return returnsObj[
        `set to ${storeDoc.storeType.includes('restaurant') ? 'preparing' : 'ready'}`
      ];
    }
    await db
      .updateTable('orders')
      .set({
        storeStatus: [...orderDoc.storeStatus, 'accepted'],
        paymentWindowCloseAt: now,
      })
      .where('id', '=', orderId)
      .executeTakeFirstOrThrow();
    // send notification to the customer to tell them to pay the service fee
    return returnsObj[
      `success and will be set to ${
        storeDoc.storeType.includes('restaurant') ? 'preparing' : 'ready'
      }`
    ];
  } */

  await db
    .updateTable("orders")
    .set({
      storeStatus: [...orderDoc.storeStatus, "accepted"],
      paymentWindowCloseAt: now
    })
    .where("id", "=", orderId)
    .executeTakeFirstOrThrow();

  return "success";
};
interface SetOrderAsAcceptedProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from "hyfn-server";

import { PAYMENT_WINDOW } from "hyfn-types";

import { returnsObj } from "hyfn-types";
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsAcceptedHandler });
};
