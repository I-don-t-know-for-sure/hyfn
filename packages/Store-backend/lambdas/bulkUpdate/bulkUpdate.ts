('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { deleteImages } from '../common/utils/deleteImages';
interface BulkUpdateProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const bulkUpdateHandler = async ({
  arg,
  client,
  session,
  event,
  ctx,
  callback,
}: MainFunctionProps) => {
  var result;

  console.log('🚀 ~ file: bulkUpdate.js ~ line 26 ~ export const handler= ~ arg', arg);
  const { storeId, country, productsArray } = arg[0];
  const validatedArray = productsArray;
  let storeFront = await client
    .db('base')
    .collection('storeFronts')
    .findOne({ _id: new ObjectId(storeId) }, {});
  console.log(JSON.stringify(storeFront), 'begining');
  // schema validations
  let updateQuery = [];
  for (let i = 0; i < validatedArray.length; i++) {
    const { _id, deletedImages, files, generateDescriptionImages, ...rest } = validatedArray[i];
    if (deletedImages) {
      await deleteImages(deletedImages);
    }

    updateQuery.push({
      updateOne: {
        filter: {
          _id: new ObjectId(_id),
        },
        update: {
          $set: {
            ...rest,
          },
        },
      },
    });
  }

  await client.db('base').collection('products').bulkWrite(updateQuery);
  return result;
};
export const handler = async (event, ctx, callback) => {
  const response = await mainWrapper({ ctx, event, callback, mainFunction: bulkUpdateHandler });
  return response;
};
