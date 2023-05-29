export const addLocalCardKeysHandler = async ({ arg, client, userId, db }: MainFunctionProps) => {
  const { terminalId, merchantId, secretKey } = arg[0];

  const encryptedSecretkey = await encryptData(secretKey, process.env.kmsKeyARN || '', new KMS());
  const now = new Date();
  console.log('here iaLocal');
  const merchantKey = hex_to_ascii(secretKey);
  const strHashData = `DateTimeLocalTrxn=${now.getTime()}&MerchantId=${merchantId}&TerminalId=${terminalId}`;
  const hashed = HmacSHA256(strHashData, merchantKey).toString().toUpperCase();
  const result = await axios.post(dataServicesURL, {
    // method: 'POST',
    // headers: {
    //   'content-type': 'application/json',
    // },
    // data: {
    MerchantReference: '',
    TerminalId: terminalId,
    MerchantId: merchantId,
    DisplayLength: 1,
    DisplayStart: 0,
    DateTimeLocalTrxn: `${now.getTime()}`,
    SecureHash: hashed,
  });
  console.log('🚀 ~ file: addLocalCardPaymentAPIKey.js:37 ~ result', result);
  console.log(JSON.stringify(result.data));
  // if (result.data.Transactions.length === 0) {
  //   return false;
  //   // or throw an error telling that the transaction doesn't exist
  // }
  const areKeysValid = Array.isArray(result.data.Transactions);
  if (!areKeysValid) {
    throw new Error(returnsObj['your keys are not valid']);
  }

  await db
    .updateTable('driverManagements')
    .set({
      terminalId,
      merchantId,
      secureKey: encryptedSecretkey,
      localCardKeyFilled: true,
    })
    .where('userId', '=', userId)
    .execute();
};
interface AddLocalCardKeysProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { KMS } from 'aws-sdk';
import { MainFunctionProps, encryptData, hex_to_ascii, mainWrapper } from 'hyfn-server';
const { default: axios } = require('axios');
const { HmacSHA256 } = require('crypto-js');
import { returnsObj } from 'hyfn-types';
const dataServicesURL = process.env.moalmlatDataService;
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: addLocalCardKeysHandler });
};
