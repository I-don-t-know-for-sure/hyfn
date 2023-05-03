import { ObjectId } from 'mongodb';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { deleteImages } from './common/utils/deleteImages';
interface DeleteProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const deleteProductHandler = async ({ arg, client, userId }: DeleteProductProps) => {
  const mongo = client;
  var result = 'initial';
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ usersIds: userId }, {});
  if (!storeDoc) throw new Error('store not found');
  const id = storeDoc._id.toString();

  const productId = arg[1];
  const db = mongo.db('base');
  const product = await db.collection(`products`).findOne({ _id: new ObjectId(productId) }, {});
  if (product.images.length > 0) {
    await deleteImages(product.images);
  }
  await db.collection(`products`).deleteOne({ storeId: id, _id: new ObjectId(productId) });

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
