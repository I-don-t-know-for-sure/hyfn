interface CompletePaymentRequestProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
import { KMS } from "aws-sdk";
import {
  decryptData,
  isLocalCardTransactionValidated,
  MainFunctionProps,
  mainWrapper,
} from "hyfn-server";
import { ObjectId } from "mongodb";
export const completePaymentRequest = async ({
  arg,
  client,
  session = undefined,
}: MainFunctionProps) => {
  const { transactionId } = arg[0];
  const paymentRequest = await client
    .db("generalData")
    .collection("paymentRequests")
    .findOne({ _id: new ObjectId(transactionId) }, { session });
  const paymentRequestAmount = paymentRequest.amount;

  if (paymentRequest.validated) {
    throw new Error("this transaction is paid");
  }
  const driverManagementDoc = await client
    .db("generalData")
    .collection("driverManagement")
    .findOne({ _id: new ObjectId(paymentRequest.merchantId) }, { session });

  const {
    localCardKeys: { MerchantId, TerminalId, secretKey },
  } = driverManagementDoc;
  const decryptedSecretKey = await decryptData({
    data: secretKey,
    kmsClient: new KMS(),
    kmsKeyARN: process.env.kmsKeyARN,
  });

  const isApproved = await isLocalCardTransactionValidated({
    amount: paymentRequestAmount,
    includeLocalCardTransactionFeeToPrice: true,
    MerchantId,
    secretKey: decryptedSecretKey,
    TerminalId,
    transactionId: transactionId,
  });
  if (!isApproved) {
    throw new Error("transaction is not approved");
  }
  await client
    .db("generalData")
    .collection("paymentRequests")
    .updateOne(
      { _id: paymentRequest._id },
      {
        $set: {
          validated: true,
        },
      },
      { session }
    );
  await client
    .db("generalData")
    .collection("driverManagement")
    .updateOne(
      { _id: new ObjectId(paymentRequest.merchantId) },
      {
        $inc: {
          balance: -Math.abs(paymentRequestAmount),
        },
      },
      { session }
    );
  return "success";
};
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: completePaymentRequest,
    validateUser: false,
  });
};
