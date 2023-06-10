import { ObjectId } from "mongodb";
import {
  adminName,
  hyfnPlusSubscriptionPrice,
  managementPayment,
  serviceFeePayment,
  storePayment,
  subscriptionPayment
} from "hyfn-types";

import { getAdminLocalCardCreds } from "./common/getAdminLocalCardCreds";
import { MainFunctionProps, decryptData } from "hyfn-server";
import { mainWrapper } from "hyfn-server";
import { createLocalCardConfigurationObject } from "hyfn-server/src";
import { add } from "mathjs";
import { calculateAmountToPayTheStoreAndAmountToReturnTheCustomer } from "./common/calculateAmountToPayTheStoreAndAmountToReturnTheCustomer";
import { KMS } from "aws-sdk";
import { returnsObj } from "hyfn-types";

interface CreateLocalCardTransactionProps
  extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
/**
 
 */
/**
 * *  have no idea what this do
 * @param {*} str1
 * @returns
 *
 * inserts new transaction document to transactions collection and returns the lightbox configuration object
 */
export const createlocalCardTransaction = async ({
  arg,
  client,
  userId,
  db
}: CreateLocalCardTransactionProps) => {
  const { type, storeId, orderId, numberOfMonths, country } = arg[0];
  const customerDoc = await db
    .selectFrom("customers")
    .selectAll()
    .where("userId", "=", userId)
    .executeTakeFirstOrThrow();

  const customerId = customerDoc.id;
  if (customerDoc.transactionId) {
    throw new Error(returnsObj["transaction in progress"]);
  }

  const result = await db.transaction().execute(async (trx) => {
    if (type === serviceFeePayment) {
      const orderDoc = await trx
        .selectFrom("orders")
        .selectAll("orders")
        .where("id", "=", orderId)
        .executeTakeFirstOrThrow();
      if (!orderDoc) {
        throw new Error(returnsObj["order not found"]);
      }
      if (
        orderDoc.storeStatus[orderDoc.storeStatus.length - 1] !== "accepted"
      ) {
        throw new Error(returnsObj["order not accepted yet"]);
      }

      if (customerDoc.id !== orderDoc.customerId) {
        throw new Error(returnsObj["user id does not match"]);
      }
      if (orderDoc?.serviceFeePaid) {
        throw new Error("service fee already paid");
      }
      const amount = orderDoc.serviceFee;

      const now = new Date();

      const newTransaction = await trx
        .insertInto("transactions")
        .values({
          customerId,
          amount,
          storeId: adminName,
          orderId,
          transactionMethod: "local card",

          transactionDate: now,
          status: ["initial"],
          type
        })
        .returning("id")
        .executeTakeFirst();

      await trx
        .updateTable("customers")
        .set({
          transactionId: newTransaction.id
        })
        .where("userId", "=", userId)
        .executeTakeFirst();
      const { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();

      const configurationObject = createLocalCardConfigurationObject({
        includeLocalCardTransactionFeeToPrice: true,
        secretKey,
        now,

        MerchantId,
        TerminalId,
        amount: amount,
        transactionId: newTransaction.id
      });
      return { configurationObject };
    }

    if (type === storePayment) {
      const storeDoc = await trx
        .selectFrom("stores")
        .innerJoin(
          "localCardKeys",
          "stores.localCardApiKeyId",
          "localCardKeys.id"
        )
        .selectAll("stores")
        .select(["merchantId", "terminalId", "secretKey"])
        .where("stores.id", "=", storeId)
        .executeTakeFirstOrThrow();

      if (!storeDoc.localCardApiKeyId) {
        throw new Error(returnsObj["store does not support local card"]);
      }

      const orderDoc = await trx
        .selectFrom("orders")
        .selectAll()
        .where("id", "=", orderId)
        .executeTakeFirstOrThrow();
      if (
        orderDoc.driverManagement === storeDoc.id &&
        orderDoc.storeStatus[orderDoc.storeStatus.length - 1] !== "picked up"
      )
        throw new Error(returnsObj["this order can be paid only on delivery"]);
      if (
        orderDoc.storeStatus[orderDoc.storeStatus.length - 1] === "accepted"
      ) {
        if (orderDoc.orderType === "Pickup")
          throw new Error(
            returnsObj["pickup orders can be paid only on pickup"]
          );

        if (orderDoc.storeId === orderDoc.driverManagement)
          throw new Error(
            returnsObj["this order can be paid only on delivery"]
          );
      }

      if (orderDoc.storeId !== storeDoc.id)
        throw new Error(returnsObj["store id does not match with order"]);

      // const storeOrder = orderDoc.orders.find((store) => store.id === storeId);
      if (
        orderDoc?.orderStatus[orderDoc?.orderStatus?.length - 1] === "canceled"
      ) {
        throw new Error(returnsObj["store order was canceled"]);
      }

      if (orderDoc.storeStatus.includes("paid")) {
        throw new Error(returnsObj["store is paid"]);
      }

      if (!orderDoc.storeStatus.includes("accepted")) {
        throw new Error(returnsObj["Store did not accept order yet"]);
      }

      const now = new Date();
      const paymentWindowCloseAt = new Date(orderDoc?.paymentWindowCloseAt);
      paymentWindowCloseAt.setHours(paymentWindowCloseAt.getHours() + 2);

      if (paymentWindowCloseAt <= now) {
        await db
          .updateTable("orders")
          .set({
            storeStatus: [
              ...orderDoc?.storeStatus?.filter(
                (status) => status !== "accepted"
              )
            ]
          })
          .where("id", "=", orderDoc.id)
          .executeTakeFirst();

        throw new Error(returnsObj["Payment window closed"]);
      }

      if (!orderDoc.serviceFeePaid) {
        throw new Error(returnsObj["Service fee not paid"]);
      }

      const orderProducts = await trx
        .selectFrom("orderProducts")
        .where("orderId", "=", orderDoc.id)
        .selectAll()
        .execute();
      const { amountToPay: amountToPayForProducts } =
        calculateAmountToPayTheStoreAndAmountToReturnTheCustomer({
          storeOrder: { addedProducts: orderProducts }
        });
      const amountToPay = add(amountToPayForProducts, 0);

      const {
        terminalId,
        merchantId,
        secretKey: encryptedSecretKey
      } = storeDoc;

      const kmsKeyARN = process.env.kmsKeyARN || "";
      const kmsClient = new KMS();

      const secretKey = await decryptData({
        data: encryptedSecretKey,
        kmsKeyARN,
        kmsClient
      });
      if (
        orderDoc.driverManagement ===
        storeDoc.id /* && storeDoc.includeDeliveryFee */
      ) {
      }
      const newTransaction = await trx
        .insertInto("transactions")
        .values({
          customerId,
          orderId,
          storeId,

          transactionMethod: "local card",

          amount: amountToPay,
          transactionDate: now,
          status: ["initial"],
          type,
          ...(orderDoc.driverManagement === storeDoc.id &&
          storeDoc.includeDeliveryFee
            ? {
                plus: { "delivery fee": orderDoc.deliveryFee },
                explaination: ["delivery fee"]
              }
            : {})
        })
        .returning("id")
        .executeTakeFirst();
      const totalTransactionAmount = add(
        amountToPay,
        orderDoc.driverManagement === storeDoc.id && storeDoc.includeDeliveryFee
          ? orderDoc.deliveryFee
          : 0
      ) as number;

      await trx
        .updateTable("customers")
        .set({
          transactionId: newTransaction.id
        })
        .where("userId", "=", userId)
        .executeTakeFirst();
      // TODO add the transaction info to the store object in the order document

      const configurationObject = createLocalCardConfigurationObject({
        includeLocalCardTransactionFeeToPrice:
          storeDoc.includeLocalCardFeeToPrice,
        amount: totalTransactionAmount,
        MerchantId: merchantId,
        now,
        secretKey,
        TerminalId: terminalId,
        transactionId: newTransaction.id
      });
      return { configurationObject };
    }
    if (type === subscriptionPayment) {
      const amount = numberOfMonths * hyfnPlusSubscriptionPrice;
      const now = new Date();

      const newTransaction = await db
        .insertInto("transactions")
        .values({
          customerId,
          amount,
          status: ["initial"],
          transactionDate: now,
          transactionMethod: "local card",
          type,
          numberOfMonths,
          storeId: adminName
        })
        .returning("id")
        .executeTakeFirst();

      await db
        .updateTable("customers")
        .set({
          transactionId: newTransaction.id
        })
        .where("userId", "=", userId)
        .executeTakeFirst();
      const { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();
      const configurationObject = await createLocalCardConfigurationObject({
        amount,
        includeLocalCardTransactionFeeToPrice: true,
        now,
        transactionId: newTransaction.id,
        MerchantId,
        secretKey,
        TerminalId
      });
      return { configurationObject };
    }

    if (type === managementPayment) {
      const userDoc = await trx
        .selectFrom("customers")
        .selectAll()
        .where("userId", "=", userId)
        .executeTakeFirst();
      if (userDoc.transactionId) {
        throw new Error(returnsObj["there is a transaction in progress"]);
      }

      const orderDoc = await trx
        .selectFrom("orders")
        .selectAll()
        .where("id", "=", orderId)
        .executeTakeFirstOrThrow();

      if (orderDoc?.orderStatus?.includes("delivered")) {
        throw new Error(returnsObj["Order delivered"]);
      }
      if (orderDoc.deliveryFeePaid) {
        throw new Error(returnsObj["delivery fee already paid"]);
      }
      if (!orderDoc.serviceFeePaid)
        throw new Error(returnsObj["service fee not paid"]);
      if (!orderDoc.storeStatus.includes("paid"))
        throw new Error(returnsObj["store not paid"]);
      if (orderDoc.orderType === "Pickup") {
        throw new Error(returnsObj["order type is pick up"]);
      }

      const managementDoc = await trx
        .selectFrom("driverManagements")
        .leftJoin(
          "localCardKeys",
          "driverManagements.localCardApiKeyId",
          "localCardKeys.id"
        )
        .selectAll("driverManagements")
        .select([
          "localCardKeys.merchantId",
          "localCardKeys.secretKey",
          "localCardKeys.terminalId"
        ])
        .where("driverManagements.id", "=", orderDoc.driverManagement)
        .executeTakeFirstOrThrow();

      if (!managementDoc.localCardApiKeyId)
        throw new Error(returnsObj["no payment method"]);

      const {
        terminalId,
        merchantId,
        secretKey: encryptedSecretKey
      } = managementDoc;

      const newTransaction = await trx
        .insertInto("transactions")
        .values({
          storeId: orderDoc.driverManagement,
          customerId: orderDoc.customerId,
          amount: orderDoc.deliveryFee,
          status: ["initial"],
          orderId,
          type: "management payment",
          transactionMethod: "local card"
        })
        .returning("id")
        .executeTakeFirst();
      await trx
        .updateTable("customers")
        .set({
          transactionId: newTransaction.id
        })
        .where("id", "=", orderDoc.customerId)
        .executeTakeFirst();
      const kmsKeyARN = process.env.kmsKeyARN || "";
      const secretKey = await decryptData({
        data: encryptedSecretKey,
        kmsKeyARN,
        kmsClient: new KMS()
      });
      const transactionObject = createLocalCardConfigurationObject({
        amount: orderDoc.deliveryFee,
        includeLocalCardTransactionFeeToPrice: true,
        MerchantId: merchantId,
        now: new Date(),
        secretKey,
        TerminalId: terminalId,
        transactionId: newTransaction.id
      });
      return { configurationObject: transactionObject };
    }
  });
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: createlocalCardTransaction
  });
};
