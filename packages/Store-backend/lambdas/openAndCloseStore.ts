import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { sql } from 'kysely';

('use strict');
interface OpenAndCloseStoreProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const openAndCloseStoreHandler = async ({
  arg,
  client,
  db,
  userId,
}: OpenAndCloseStoreProps) => {
  const response = await db.transaction().execute(async (trx) => {
    const storeDoc = await trx
      .selectFrom('stores')

      .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
      .innerJoin('localCardKeys', 'localCardKeys.id', 'localCardApiKeyId')
      .selectAll('stores')
      .select(['inUse', 'localCardKeys.id as cardId'])
      .executeTakeFirstOrThrow();

    if (!storeDoc.localCardApiKeyId) {
      throw new Error('no payment method');
    }
    const storeId = storeDoc.id;

    if (!storeDoc.monthlySubscriptionPaid) {
      await trx
        .updateTable('stores')
        .set({
          opened: false,
        })
        .where('id', '=', storeDoc.id)
        .execute();
    }

    if (
      storeDoc.storeInfoFilled &&
      storeDoc.inUse &&
      storeDoc.storeOwnerInfoFilled &&
      storeDoc.monthlySubscriptionPaid &&
      // storeTrustsTwoDrivers &&
      !storeDoc.opened
    ) {
      await trx
        .updateTable('stores')
        .set({
          opened: true,
          acceptingOrders: true,
        })
        .where('id', '=', storeId)
        .execute();

      return 'success';
    }
    // delete storeFront document here and update store document that to isOpen : false

    await trx
      .updateTable('stores')
      .set({
        opened: false,
        acceptingOrders: false,
      })
      .where('id', '=', storeId)
      .execute();
    return 'success';
  });

  return response;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
};
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: openAndCloseStoreHandler,
  });
};
