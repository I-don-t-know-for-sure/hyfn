import { ObjectId } from 'mongodb';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { deleteImages } from './common/utils/deleteImages';
interface DeleteProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const deleteProductHandler = async ({ arg, client, userId, db }: DeleteProductProps) => {
  const mongo = client;
  var result = 'initial';

  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', [userId])
    .executeTakeFirstOrThrow();

  const id = storeDoc.id;

  const productId = arg[1];

  const product = await db
    .selectFrom('products')
    .select('images')
    .where('storeId', '==', id)
    .where('id', '==', productId)
    .executeTakeFirstOrThrow();
  if (product.images.length > 0) {
    await deleteImages(product.images);
  }

  await db
    .deleteFrom('products')
    .where('storeId', '==', id)
    .where('id', '==', productId)
    .executeTakeFirstOrThrow();
  result = 'deleted';

  return result;
};
export const handler = async (event, ctx) => {
  // await argValidations(arg);
  return await mainWrapper({
    event,
    ctx,
    mainFunction: deleteProductHandler,
  });
};
