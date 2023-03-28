import { hex_to_ascii } from "./hex_to_ascii";
import axios from "axios";
import { HmacSHA256 } from "crypto-js";
import { add, equal, multiply } from "mathjs";
import { LOCAL_CARD_FEE, transactionApproved } from "hyfn-types";

const dataServicesURL = process.env.moalmlatDataService;

export const isLocalCardTransactionValidated = async ({
  transactionId,
  MerchantId,
  TerminalId,
  secretKey,
includeLocalCardTransactionFeeToPrice = false,
  amount: amountFromTransaction,
}: {
  transactionId: string;
  MerchantId: string;
  TerminalId: string;
  secretKey: string;
  amount: number;
  includeLocalCardTransactionFeeToPrice: boolean
}) => {
  console.log(
    "🚀 ~ file: validateLocalCardTransaction.js:21 ~ validateLocalCardTransaction ~ result",
    "bdhcbhdbchdbchdchdbchdbchbdhcbdh"
  );

  console.log(
    "🚀 ~ file: isLocalCardTransactionValidated.js:90 ~ amountFromTransaction",
    typeof amountFromTransaction
  );
  const now = new Date();
  console.log(dataServicesURL);
  const merchantKey = hex_to_ascii(secretKey);

  const strHashData = `DateTimeLocalTrxn=${now.getTime()}&MerchantId=${MerchantId}&TerminalId=${TerminalId}`;
  const hashed = HmacSHA256(strHashData, merchantKey).toString().toUpperCase();
  console.log("🚀 ~ file: isLocalCardTransactionValidated.js:23 ~ hashed", {
    dataServicesURL,
    MerchantReference: transactionId,
    TerminalId: TerminalId,
    MerchantId: MerchantId,
    DisplayLength: 1,
    DisplayStart: 0,
    DateTimeLocalTrxn: `${now.getTime()}`,
    SecureHash: hashed,
  });
  var result: any;
  try {
    result = await axios({
      url: dataServicesURL,

      method: "post",

      headers: {
        "content-type": "application/json",
      },

      data: {
        MerchantReference: transactionId,
        TerminalId: TerminalId,
        MerchantId: MerchantId,
        DisplayLength: 1,
        DisplayStart: 0,
        DateTimeLocalTrxn: `${now.getTime()}`,
        SecureHash: hashed,
      },
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: isLocalCardTransactionValidated.js:77 ~ error",
      error
    );
    console.log(error);
  }

  // const result = await got
  //   .post(dataServicesURL, {
  //     json: {
  //       MerchantReference: transactionId,
  //       TerminalId: TerminalId,
  //       MerchantId: MerchantId,
  //       DisplayLength: 1,
  //       DisplayStart: 0,
  //       DateTimeLocalTrxn: `${now.getTime()}`,
  //       SecureHash: hashed,
  //     },
  //   })
  //   .json();

  console.log(
    "🚀 ~ file: isLocalCardTransactionValidated.js:39 ~ result",
    result.data
  );

  if (result.data.Transactions.length === 0) {
    throw new Error("transaction not found");
    // or throw an error telling that the transaction doesn't exist
  }
  const amount = parseInt(
    (parseFloat(amountFromTransaction.toFixed(3)) * 1000).toFixed(3)
  );
  console.log(
    "🚀 ~ file: isLocalCardTransactionValidated.js:95 ~ amount",
    amount
  );
  const isApproved =
    result.data.Transactions[0].DateTransactions[0].Status ===
    transactionApproved;
  console.log(result.data.Transactions[0].DateTransactions[0].Status);
  const transactionAmount = parseInt(
    result.data.Transactions[0].DateTransactions[0].Amnt
  );
  console.log(
    "🚀 ~ file: isLocalCardTransactionValidated.js:99 ~ transactionAmount",
    transactionAmount
  );
  // const transactionAmountWithDecimal = (transactionAmount / Math.pow(10, 3)).toFixed(3);
  // console.log(
  //   '🚀 ~ file: isLocalCardTransactionValidated.js:93 ~ transactionAmount',
  //   transactionAmountWithDecimal
  // );

  console.log(
    "🚀 ~ file: isLocalCardTransactionValidated.js:99 ~ amount",
    amount
  );
const amountWithFee = includeLocalCardTransactionFeeToPrice ? add(amount, multiply(amount, LOCAL_CARD_FEE)) : amount
  if (!equal(transactionAmount, amountWithFee)) {
    throw new Error("transaction amount does not match");
  }
  console.log(
    "🚀 ~ file: isLocalCardTransactionValidated.js ~ line 39 ~ result",
    isApproved
  );

  // if (isApproved) {
  //   await updateOne({
  //     query: { _id: new ObjectId(transactionId) },
  //     update: {
  //       $set: { validated: true },
  //     },
  //     options: {
  //       session,
  //     },
  //     collection: client.db("generalData").collection("transactions"),
  //   });
  // }
  return isApproved;
};
