('use strict');
import {
  MainFunctionProps,
  bulkUpdate,
  mainWrapper,
  tProduct,
  tProducts,
  toSnakeCase,
} from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { deleteImages } from './common/utils/deleteImages';
import { sql } from 'kysely';
interface BulkUpdateProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const bulkUpdateHandler = async ({ arg, client, userId, db }: MainFunctionProps) => {
  var result;

  const { productsArray } = arg[0];
  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`ARRAY[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();

  const validatedArray = productsArray;

  // schema validations
  let updateQuery = [];
  for (let i = 0; i < validatedArray.length; i++) {
    const { id, deletedImages, files, generateDescriptionImages, ...rest } = validatedArray[i];
    // if (deletedImages) {
    //   await deleteImages(deletedImages);
    // }

    updateQuery.push({
      filter: `${tProducts.id} = '${id}'::uuid`,
      update: {
        title: rest.title,
        [tProducts.prevPrice]: rest.prevPrice,
        [tProducts.description]: rest.description,
        [tProducts.isActive]: rest.isActive,
        [tProducts.measurementSystem]: rest.measurementSystem,
        [tProducts.price]: rest.price,
      },
    });
  }
  const columns = Object.keys(tProducts)
    .filter(
      (key) =>
        !(
          [
            'id',
            'storeId',
            'whiteBackgroundImages',
            'images',
            'options',
            'hasOptions',
            'city',
            'currency',
            '_',
          ] satisfies (keyof typeof tProducts)[]
        ).includes(key as any)
    )
    .map((key) => toSnakeCase(tProducts[key]));

  const updateObj = bulkUpdate(updateQuery, columns);

  await db
    .updateTable('products')
    .set({
      title: sql.raw(updateObj[tProducts.title]),
      description: sql.raw(updateObj[tProducts.description]),
      isActive: sql.raw(updateObj[tProducts.isActive]),
      prevPrice: sql.raw(updateObj[tProducts.prevPrice]),
      price: sql.raw(updateObj[tProducts.price]),
      measurementSystem: sql.raw(updateObj[tProducts.measurementSystem]),
    })
    .execute();

  return result;
};
export const handler = async (event, ctx, callback) => {
  const response = await mainWrapper({ ctx, event, callback, mainFunction: bulkUpdateHandler });
  return response;
};
