export const getProductsForBulkUpdateHandler = async ({
  arg,
  client,
  userId,
  db,
}: MainFunctionProps) => {
  const id = arg[0];
  const lastDocId = arg[1];
  const filter = arg[2];
  const ALL_PPRODUCTS = 'all';
  const filters = { active: true, inActive: false };
  const isFiltered = filter !== ALL_PPRODUCTS;
  const queryDoc =
    lastDocId && isFiltered
      ? {
          storeId: id,
          _id: { $gt: new ObjectId(lastDocId) },
          isActive: filters[filter],
        }
      : lastDocId && !isFiltered
      ? {
          storeId: id,
          _id: { $gt: new ObjectId(lastDocId) },
        }
      : !lastDocId && !isFiltered
      ? {
          storeId: id,
        }
      : {
          isActive: filters[filter],
          storeId: id,
        };

  const products = await db
    .selectFrom('products')
    .select(['id', 'title', 'isActive'])
    .where('storeId', '=', id)
    .limit(2)
    .execute();
  return products;
};
interface GetProductsForBulkUpdateProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, mainFunction: getProductsForBulkUpdateHandler });
};
