import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';

interface OpenAndCloseStoreProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const openAndCloseStoreHandler = async ({


  db,
  userId,
}: OpenAndCloseStoreProps) => {
  const response = await db.transaction().execute(async (trx) => {
    const storeDoc = await trx
      .selectFrom('stores')

      .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]` as any)

      .selectAll('stores')

      .executeTakeFirstOrThrow();

    const activeOrders = await db
      .selectFrom('orders')
      .where('storeId', '=', storeDoc.id)
      .where(({ not, cmpr }) =>
        not(cmpr('orderStatus', '@>', sql`array[${sql.join(['delivered'])}]::varchar[]` as any))
      )
      .select('id')
      .limit(1)
      .execute();

    if (activeOrders.length > 0) throw new Error(returnsObj['you still have active orders']);
    if (!storeDoc.localCardApiKeyId) {
      throw new Error(returnsObj['no payment method']);
    }
    const storeId = storeDoc.id;

    if (!storeDoc.monthlySubscriptionPaid) {
      await trx
        .updateTable('stores')
        .set({
          opened: false,
          acceptingOrders: false
        })
        .where('id', '=', storeDoc.id)
        .execute();
        throw new Error(returnsObj['you are not subscribed'])
    }

    if (
      storeDoc.storeInfoFilled &&
      storeDoc.localCardApiKeyId &&
      storeDoc.storeOwnerInfoFilled &&
      storeDoc.monthlySubscriptionPaid &&

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
