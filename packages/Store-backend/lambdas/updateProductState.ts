('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
interface UpdateProductStateProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const updateProductStateHandler = async ({
  arg,
  client,
  db,
  userId,
}: UpdateProductStateProps) => {
  const product = arg[0];
  const {
    textInfo,
    pricing,
    inventory,
    measurementSystem,
    shipping,
    options,
    isActive,
    imagesURLs,
    collections,
  } = product;

  // const { storeFrontId, id, country, city } = arg[1];
  const productId = arg[2];
  var returnValue = 'initial';

  await db
    .updateTable('products')
    .set({
      isActive: !isActive,
    })
    .where('id', '=', productId)
    .executeTakeFirst();

  return 'success';
};
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: updateProductStateHandler,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
};
