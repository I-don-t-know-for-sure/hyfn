('use strict');
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
import { ObjectId } from 'mongodb';
interface UpdateProductStateProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const updateProductStateHandler = async ({
  arg,
  client,

  userId,
}: UpdateProductStateProps) => {
  const session = client.startSession();
  const response = await withTransaction({
    session,
    fn: async () => {
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
    },
  });
  await session.endSession();
  return response;
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
