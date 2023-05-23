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
  includeLocalCardTransactionFeeToPrice: boolean;
}) => {
  const amountWithFee = includeLocalCardTransactionFeeToPrice
    ? add(
        amountFromTransaction,
        multiply(amountFromTransaction, LOCAL_CARD_FEE)
      )
    : amountFromTransaction;
  const transactionDocAmount = parseInt(
    /* Math.round */ (amountWithFee * 1000).toFixed(3)
  );
  const now = new Date();

  const merchantKey = hex_to_ascii(secretKey);

  const strHashData = `DateTimeLocalTrxn=${now.getTime()}&MerchantId=${MerchantId}&TerminalId=${TerminalId}`;
  const hashed = HmacSHA256(strHashData, merchantKey).toString().toUpperCase();

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
  }

  if (result.data.Transactions.length === 0) {
    throw new Error("transaction not found");
    // or throw an error telling that the transaction doesn't exist
  }

  const isApproved =
    result.data.Transactions[0].DateTransactions[0].Status ===
    transactionApproved;

  const transactionAmount = parseInt(
    result.data.Transactions[0].DateTransactions[0].Amnt
  );

  if (!equal(transactionAmount, transactionDocAmount)) {
    throw new Error("transaction amount does not match");
  }
  console.log(
    "🚀 ~ file: isLocalCardTransactionValidated.js ~ line 39 ~ result",
    isApproved
  );

  // if (isApproved) {
  //   await updateOne({
  //     query: {id: new ObjectId(transactionId) },
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
