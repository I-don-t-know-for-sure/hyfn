interface CreatePaymentRequestObjectProps
  extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
import { KMS } from "aws-sdk";
import {
  createLocalCardConfigurationObject,
  decryptData,
  MainFunctionProps,
  mainWrapper,
} from "hyfn-server";
const { ObjectId } = require("mongodb");
export const createStoreLocalCardTransaction = async ({
  arg,
  client,
  session,
}: MainFunctionProps) => {
  // const { customerId, orderId, storeId, country } = arg[0];
  // const { customerId, orderId, storeId, country } = arg[0];
  const { transactionId } = arg[0];
  const paymentRequest = await client
    .db("generalData")
    .collection("paymentRequests")
    .findOne({ id: new ObjectId(transactionId) }, { session });
  const driverManagementDoc = await client
    .db("generalData")
    .collection("driverManagement")
    .findOne({ id: new ObjectId(paymentRequest.merchantId) }, { session });
  if (!driverManagementDoc.localCardAPIKeyFilled) {
    throw new Error("store does not support local card");
  }
  const {
    localCardKeys: { MerchantId, TerminalId, secretKey },
  } = driverManagementDoc;
  const decryptedSecretKey = await decryptData({
    data: secretKey,
    kmsClient: new KMS(),
    kmsKeyARN: process.env.kmsKeyARN,
  });
  // if (!storeDoc.storeType.includes(STORE_TYPE_RESTAURANT)) {
  //   const storeReady = storeOrder.orderStatus === STORE_STATUS_READY_FOR_PAYMENT;
  //   if (!storeReady) {
  //     throw new Error('store not ready yet');
  //   }
  // }
  // if (!storeDoc.storeType.includes(STORE_TYPE_RESTAURANT)) {
  //   const storeReady = storeOrder.orderStatus === ORDER_STATUS_READY;
  //   if (!storeReady) {
  //     throw new Error('store not ready yet');
  //   }
  // }
  // if (driverManagementDoc.storeType.includes(STORE_TYPE_RESTAURANT)) {
  //   const now = new Date();
  //   const accepted = storeOrder.orderStatus === STORE_STATUS_ACCEPTED;
  //   if (!accepted) {
  //     throw new Error('Store did not accept order yet');
  //   }
  //   const paymentWindowCloseAt = new Date(storeOrder?.paymentWindowCloseAt);
  //   if (paymentWindowCloseAt <= now) {
  //     await updateOne({
  //       query: {id: new ObjectId(orderId) },
  //       update: {
  //         $set: {
  //           ['orders.$[store].orderStatus']: STORE_STATUS_PENDING,
  //           // ['status.$[store].status']: STORE_STATUS_PENDING,
  //         },
  //       },
  //       options: { arrayFilters: [{ 'store.id': new ObjectId(paymentRequestId) }] },
  //       collection: client.db("base").collection('orders'),
  //     });
  //     throw new Error('Payment window closed');
  //   }
  // }
  if (paymentRequest.validated) {
    throw new Error("not paid");
  }
  // get order document to calculate the amount
  const now = new Date();
  // calculate the amount for the transaction
  await client
    .db("generalData")
    .collection("paymentRequests")
    .updateOne(
      { id: new ObjectId(transactionId) },
      {
        // amount to return to customer if there were products that were not found in the store. the amount is the service fee for the products
        $set: {
          transactionDate: now,
        },
      },
      { session }
    );
  // TODO add the transaction info to the store object in the order document
  const configurationObject = createLocalCardConfigurationObject({
    amount: paymentRequest.amount,
    MerchantId,
    now,
    secretKey: decryptedSecretKey,
    TerminalId,
    transactionId: transactionId,
    includeLocalCardTransactionFeeToPrice: true,
  });
  return { configurationObject };
};
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: createStoreLocalCardTransaction,
  });
};
