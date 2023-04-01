export const updateProductStateHandler = async ({ arg, client, session }: MainFunctionProps) => {
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
  console.log(arg);
  const { storeFrontId, id, country, city } = arg[1];
  const productId = arg[2];
  var returnValue = 'initial';
  await client
    .db('base')
    .collection('products')
    .updateOne(
      {
        _id: new ObjectId(productId),
      },
      {
        $set: {
          isActive,
        },
      },
      { session }
    );
  returnValue = 'success';
  return { message: returnValue };
};
interface UpdateProductStateProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapperWithSession({
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
