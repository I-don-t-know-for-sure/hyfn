interface AddLocalCardPaymentAPIKeyProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { HmacSHA256 } from 'crypto-js';
import axios from 'axios';
import { calculateFreeMonth } from './common/calculateFreeMonth';
import { KMS } from 'aws-sdk';
import { encryptData, hex_to_ascii, MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';
const dataServicesURL = process.env.moalmlatDataService;

const addLocalCardPaymentAPIKey = async ({ client, arg, userId, db }: MainFunctionProps) => {
  const { TerminalId, MerchantId, secretKey } = arg[0];

  const userDocument = await db
    .selectFrom('stores')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  const { id } = userDocument;
  const storeId = id;
  const encryptedSecretkey = await encryptData(secretKey, process.env.kmsKeyARN || '', new KMS());

  const now = new Date();

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

  const areKeysValid = Array.isArray(result.data.Transactions);
  if (!areKeysValid) {
    throw new Error(returnsObj['your keys are not valid']);
  }
  const response = await db.transaction().execute(async (trx) => {
    const localCardKey = await trx
      .selectFrom('localCardKeys')
      .selectAll()
      .where('merchantId', '=', MerchantId)
      .executeTakeFirst();

    // if the store already have localcardkeys then we change the keys and set the old inUse to false
    if (userDocument.localCardApiKeyId) {
      if (userDocument.localCardApiKeyId === localCardKey.id) {
        throw new Error(returnsObj['this key already linked to your store']);
      }
      await trx
        .updateTable('localCardKeys')
        .set({
          inUse: false,
          storeId: '',
        })
        .where('id', '=', userDocument.localCardApiKeyId)
        .execute();
    }
    if (localCardKey) {
      if (localCardKey.inUse) {
        throw new Error(returnsObj['these keys are already being used by another account']);
      }
      // establish relationship between localCardKey and store
      await trx
        .updateTable('stores')
        .set({
          localCardApiKeyId: localCardKey.id,
        })
        .where('userId', '=', userId)
        .execute();
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

    let subscriptionInfo = calculateFreeMonth({ storeDoc: userDocument });
    const insertedLocalCardKey = await trx
      .insertInto('localCardKeys')
      .values({
        merchantId: MerchantId,
        terminalId: TerminalId,
        secretKey: encryptedSecretkey,
        inUse: true,
      })
      .returning('id')
      .executeTakeFirst();
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
    // establish relationship between localCardKey and store

    // add to the activity that this store at least had a relationship with this localCardKey

    await trx
      .insertInto('localCardKeyStoreActivity')
      .values({
        localCardKeyId: insertedLocalCardKey.id,
        storeId,
      })
      .executeTakeFirst();

    return returnsObj['success and added a month free'];
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
