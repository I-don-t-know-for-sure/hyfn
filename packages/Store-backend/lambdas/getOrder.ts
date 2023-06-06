import {
  MainFunctionProps,
  buildJson,
  mainWrapper,
  tOrderProduct,
  tOrderProducts,
  tStore,
  tStores,
} from 'hyfn-server';

interface GetOrderProps extends MainFunctionProps {
  arg: any;
}

export const getOrder = async ({ arg, userId, db }: GetOrderProps) => {
  const { orderId } = arg[0];

  return await db
    .selectFrom('orders')
    .innerJoin('orderProducts', 'orderProducts.orderId', 'orders.id')
    .innerJoin('stores', 'orders.storeId', 'stores.id')
    .selectAll('orders')
    .select(buildJson<tOrderProduct>(tOrderProducts, '*').as('addedProducts'))
    .select(
      buildJson<tStore>(tStores, [
        'storeName',
        'description',
        'storePhone',
        'storeType',
        'lat',
        'long',
        'id',
        'image',
        'opened',
      ]).as('stores')
    )
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getOrder });
};
