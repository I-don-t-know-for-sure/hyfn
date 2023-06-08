interface AddLocalCardPaymentAPIKeyProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { HmacSHA256 } from 'crypto-js';
import axios from 'axios';
import { calculateFreeMonth } from './common/calculateFreeMonth';
import { KMS } from 'aws-sdk';
import { encryptData, hex_to_ascii, MainFunctionProps, mainWrapper } from 'hyfn-server';

import { returnsObj } from 'hyfn-types';
const dataServicesURL = process.env.moalmlatDataService;

export const addLocalCardPaymentAPIKey = async ({ client, arg, userId, db }: MainFunctionProps) => {
  const { terminalId, merchantId, secretKey, flag = 'store' } = arg[0];

  const userDocument = await db
    .selectFrom(flag === 'store' ? 'stores' : 'driverManagements')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  const { id } = userDocument;
  const storeId = id;
  const encryptedSecretkey = await encryptData(secretKey, process.env.kmsKeyARN || '', new KMS());

  const now = new Date();

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

  const areKeysValid = Array.isArray(result.data.Transactions);
  if (!areKeysValid) {
    throw new Error(returnsObj['your keys are not valid']);
  }
  const response = await db.transaction().execute(async (trx) => {
    const localCardKey = await trx
      .selectFrom('localCardKeys')
      .selectAll()
      .where('merchantId', '=', merchantId)
      .executeTakeFirst();

    // if the store already have localcardkeys then we change the keys and set the old inUse to false
    if (userDocument.localCardApiKeyId) {
      if (userDocument.localCardApiKeyId === localCardKey.id) {
        throw new Error(returnsObj['this key already linked to your store']);
      }
      // await trx
      //   .updateTable('localCardKeys')
      //   .set({
      //     inUse: false,
      //   })
      //   .where('id', '=', userDocument.localCardApiKeyId)
      //   .execute();
    }
    let subscriptionInfo = calculateFreeMonth({ storeDoc: userDocument });
    if (localCardKey) {
      const usersUsingTheApiKey = await trx
        .selectFrom(flag === 'store' ? 'stores' : 'driverManagements')
        .select(['id'])
        .where('localCardApiKeyId', '=', localCardKey.id)
        .executeTakeFirst();
      if (usersUsingTheApiKey) {
        throw new Error(returnsObj['these keys are already being used by another account']);
      }

      // establish relationship between localCardKey and store
      await trx
        .updateTable(flag === 'store' ? 'stores' : 'driverManagements')
        .set({
          localCardApiKeyId: localCardKey.id,
        })
        .where('userId', '=', userId)
        .executeTakeFirst();
      // add to the activity that this store at least had a relationship with this localCardKey
      await trx
        .insertInto('localCardKeyStoreActivity')
        .values({
          localCardKeyId: localCardKey.id,
          storeId,
        })
        .execute();

      return returnsObj['success'];
    }

    const insertedLocalCardKey = await trx
      .insertInto('localCardKeys')
      .values({
        merchantId: merchantId,
        terminalId: terminalId,
        secretKey: encryptedSecretkey,
        // inUse: true,
      })
      .returning('id')
      .executeTakeFirst();
    if (flag === 'store') {
      await trx
        .updateTable('stores')
        .set({
          monthlySubscriptionPaid: true,
          timeOfPayment: subscriptionInfo.timeOfPayment,
          expirationDate: subscriptionInfo.expirationDate,
          numberOfMonths: subscriptionInfo.numberOfMonths,
          localCardApiKeyId: insertedLocalCardKey.id,
        })
        .where('userId', '=', userId)
        .execute();
    } else {
      await trx
        .updateTable('driverManagements')
        .set({
          localCardApiKeyId: insertedLocalCardKey.id,
        })
        .where('userId', '=', userId)
        .execute();
    }

    await trx
      .insertInto('localCardKeyStoreActivity')
      .values({
        localCardKeyId: insertedLocalCardKey.id,
        storeId,
      })
      .executeTakeFirst();
    // establish relationship between localCardKey and store

    // add to the activity that this store at least had a relationship with this localCardKey

    return flag === 'store' ? returnsObj['success and added a month free'] : returnsObj['success'];
  });

  return response;
};
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: addLocalCardPaymentAPIKey,
    withUserDocument: true,
    projection: { id: 1, userId: 1, subscriptionInfo: 1 },
  });
};
