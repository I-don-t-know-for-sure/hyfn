import { HmacSHA256 } from "crypto-js";
import { hex_to_ascii } from "./hex_to_ascii";
import { ObjectId } from "mongodb";
import { add, multiply } from "mathjs";
import { LOCAL_CARD_FEE } from "hyfn-types";

export function createLocalCardConfigurationObject({
  secretKey,
  now,
  MerchantId,
  TerminalId,
  amount,
  transactionId,
  includeLocalCardTransactionFeeToPrice = false,
}: {
  secretKey: string;
  now: any;
  MerchantId: string;
  TerminalId: string;
  amount: number;
  transactionId: string;
  includeLocalCardTransactionFeeToPrice: boolean;
}) {
  const merchantKey = hex_to_ascii(secretKey);
  const amountWithFee = includeLocalCardTransactionFeeToPrice
    ? add(amount, multiply(amount, LOCAL_CARD_FEE))
    : amount;
  const strHashData = `Amount=${parseInt(
    Math.round(amountWithFee * 1000).toFixed(3)
  )}&DateTimeLocalTrxn=${now.getTime()}&MerchantId=${MerchantId}&MerchantReference=${transactionId}&TerminalId=${TerminalId}`;

  const hashed = HmacSHA256(strHashData, merchantKey).toString().toUpperCase();

  const configurationObject = {
    MID: MerchantId,
    TID: TerminalId,
    AmountTrxn: parseInt(Math.round(amountWithFee * 1000).toFixed(3)),
    MerchantReference: transactionId,
    TrxDateTime: `${now.getTime()}`,

    SecureHash: hashed,
  };
  return configurationObject;
}
