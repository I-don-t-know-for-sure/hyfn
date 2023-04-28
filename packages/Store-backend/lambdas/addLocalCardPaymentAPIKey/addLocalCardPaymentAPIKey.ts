interface AddLocalCardPaymentAPIKeyProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { HmacSHA256 } from 'crypto-js';
import axios from 'axios';
import { calculateFreeMonth } from '../common/calculateFreeMonth';
import { KMS } from 'aws-sdk';
import {
  encryptData,
  hex_to_ascii,
  MainFunctionProps,
  mainWrapper,
  withTransaction,
} from 'hyfn-server';
import { ObjectId } from 'mongodb';
const dataServicesURL = process.env.moalmlatDataService;

const addLocalCardPaymentAPIKey = async ({ client, arg, userId }: MainFunctionProps) => {
  const session = client.startSession();
  const response = await withTransaction({
    session,
    fn: async () => {
      const { TerminalId, MerchantId, secretKey } = arg[0];
      const userDocument = await client
        .db('generalData')
        .collection('storeInfo')
        .findOne({ userId });
      if (!userDocument) throw new Error('document not found');

      const { _id } = userDocument;
      const storeId = _id.toString();
      const encryptedSecretkey = await encryptData(
        secretKey,
        process.env.kmsKeyARN || '',
        new KMS()
      );
      console.log(
        '🚀 ~ file: isLocalCardTransactionValidated.js:8 ~ dataServicesURL',
        dataServicesURL
      );
      const now = new Date();
      console.log('here iaLocal');
      const merchantKey = hex_to_ascii(secretKey);
      const strHashData = `DateTimeLocalTrxn=${now.getTime()}&MerchantId=${MerchantId}&TerminalId=${TerminalId}`;
      const hashed = HmacSHA256(strHashData, merchantKey).toString().toUpperCase();
      const result = await axios.post(dataServicesURL, {
        // method: 'POST',
        // headers: {
        //   'content-type': 'application/json',
        // },
        // data: {
        MerchantReference: '',
        TerminalId: TerminalId,
        MerchantId: MerchantId,
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
      const paymentKeys = await client
        .db('generalData')
        .collection('localCardKeys')
        .findOne(
          { MerchantId },
          {
            session,
            projection: {
              inUse: 1,
            },
          }
        );
      const storeDoc = await client
        .db('generalData')
        .collection('storeInfo')
        .findOne({ userId }, { session });
      // if the store already have localcardkeys then we change the keys and set the old inUse to false
      if (storeDoc.localCardAPIKeyFilled) {
        // const secretKey = await decryptData(storeDoc.localCardAPIKey.secretKey)
        await client
          .db('generalData')
          .collection('localCardKeys')
          .updateOne(
            { MerchantId },
            {
              $set: {
                inUse: false,
                storeId: '',
              },
            },
            { session }
          );
      }
      if (paymentKeys) {
        if (paymentKeys.inUse) {
          throw new Error('these keys are already being used by another account');
        }
        await client
          .db('generalData')
          .collection('storeInfo')
          .updateOne(
            { userId },
            {
              $set: {
                localCardAPIKey: {
                  TerminalId,
                  MerchantId,
                  secretKey: encryptedSecretkey,
                },
                localCardAPIKeyFilled: true,
              },
            },
            {
              session,
            }
          );
        await client
          .db('generalData')
          .collection('localCardKeys')
          .updateOne(
            { MerchantId },
            {
              $set: {
                inUse: true,
                storeId,
              },
            },
            {
              session,
            }
          );
        return 'success';
      }
      let subscriptionInfo = calculateFreeMonth({ storeDoc: userDocument });
      await client
        .db('generalData')
        .collection('storeInfo')
        .updateOne(
          { userId },
          {
            $set: {
              localCardAPIKeyFilled: true,
              localCardAPIKey: {
                TerminalId,
                MerchantId,
                secretKey: encryptedSecretkey,
              },
              subscriptionInfo,
              monthlySubscriptionPaid: true,
            },
          },
          {
            session,
          }
        );
      await client
        .db('base')
        .collection('storeFronts')
        .updateOne(
          { _id: new ObjectId(storeDoc._id.toString()) },
          {
            $set: {
              city: storeDoc.city,
            },
          },
          { session }
        );
      await client.db('generalData').collection('localCardKeys').insertOne(
        {
          TerminalId,
          MerchantId,
          secretKey: encryptedSecretkey,
          inUse: true,
          storeId,
        },
        {
          session,
        }
      );
      return 'success and added a month free';
    },
  });
  await session.endSession();
  return response;
};
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: addLocalCardPaymentAPIKey,
    withUserDocument: true,
    projection: { _id: 1, userId: 1, subscriptionInfo: 1 },
  });
};
