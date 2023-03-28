import { KMS } from 'aws-sdk';
import { encryptData, hex_to_ascii, mainWrapper } from 'hyfn-server';

const { default: axios } = require('axios');

const { HmacSHA256 } = require('crypto-js');

const dataServicesURL = process.env.moalmlatDataService;

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, userId }) => {
    const { terminalId, merchantId, secretKey } = arg[0];
    console.log('🚀 ~ file: addLocalCardKeys.js:12 ~ mainFunction ~ secretKey', secretKey);

    console.log(
      '🚀 ~ file: isLocalCardTransactionValidated.js:8 ~ dataServicesURL',
      dataServicesURL
    );

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
      throw new Error('your keys are not valid');
    }

    await client
      .db('generalData')
      .collection('driverManagement')
      .updateOne(
        { userId },
        {
          $set: {
            localCardKeys: {
              TerminalId: terminalId,
              MerchantId: merchantId,
              secretKey: encryptedSecretkey,
            },
            localCardAPIKeyFilled: true,
          },
        },
        {}
      );
  };
  return await mainWrapper({ event, mainFunction });
};
