export const getProductsForBulkUpdateHandler = async ({
  arg,
  client,
  userId,
  db,
}: MainFunctionProps) => {
  const { products } = arg[0];
  const productsForBulkUpdate = await db
    .selectFrom('products')
    .select([
      'id',
      'title',
      'isActive',
      'description',
      'images',
      'measurementSystem',
      'prevPrice',
      'price',
    ])
    .where('id', '=', sql`any(array[${sql.join(products)}]::uuid[])`)
    .limit(2)
    .execute();
  return productsForBulkUpdate;
};
interface GetProductsForBulkUpdateProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, mainFunction: getProductsForBulkUpdateHandler });
};
