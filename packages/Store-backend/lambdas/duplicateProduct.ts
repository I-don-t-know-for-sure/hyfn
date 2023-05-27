('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';
import { ObjectId } from 'mongodb';
interface DuplicateProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const duplicateProductHandler = async ({
  arg,
  client,
  userId,
  db,
}: DuplicateProductProps) => {
  var result;

  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  if (!storeDoc) throw new Error('store not found');
  const storeId = storeDoc.id;
  const { times, productId, country } = arg[0];

  const { id, ...product } = await db
    .selectFrom('products')
    .selectAll()
    .where('id', '=', productId)
    .executeTakeFirstOrThrow();

  if (times > 30) {
    const products = Array(30)
      .fill(product)
      .map((value) => {
        return {
          ...value,
          isActive: false,
        };
      });
    // await client.db('base').collection('products').insertMany(products, {});
    await db.insertInto('products').values(products).execute();
    return;
  }
  if (times === 0 || times < 0) {
    const products = Array(1)
      .fill(product)
      .map((value) => {
        return {
          ...value,
          isActive: false,
        };
      });
    await db.insertInto('products').values(products).execute();

    return;
  }
  const products = new Array(times).fill(product).map((value) => {
    return {
      ...value,
      isActive: false,
    };
  });
  await db.insertInto('products').values(products).execute();

  return result;
};
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: duplicateProductHandler,
  });
};
