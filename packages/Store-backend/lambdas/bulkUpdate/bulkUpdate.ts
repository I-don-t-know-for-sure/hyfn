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
    const { _id, ...rest } = validatedArray[i];
    // if (!rest.isActive) {
    //   const oldProduct = await findOne(
    //     { _id: new ObjectId(_id) },
    //     {},
    //     client.db("base").collection("products")
    //   );
    //   if (oldProduct.isActive) {
    //     oldProduct.collections.map(({ value }) => {
    //       const key = Object.keys(storeFront).find((key) => {
    //         console.log(
    //           storeFront[key]?.collectionId === value,
    //           storeFront[key]
    //         );
    //         return storeFront[key]?.collectionId === value;
    //       });
    //       if (!key) {
    //         return;
    //       }
    //       storeFront[key] = {
    //         ...storeFront[key],
    //         products: storeFront[key].products.filter((storeFrontProduct) => {
    //           console.log(
    //             storeFrontProduct._id.toString() !== _id,
    //             "storeFrontssssss"
    //           );
    //           return storeFrontProduct._id.toString() !== _id;
    //         }),
    //       };
    //     });
    //   }
    // }
    // if (rest.isActive) {
    //   const oldProduct = await findOne(
    //     { _id: new ObjectId(_id) },
    //     {},
    //     client.db("base").collection("products")
    //   );
    //   if (oldProduct.isActive) {
    //     oldProduct.collections.map(({ value }) => {
    //       const key = Object.keys(storeFront).find((key) => {
    //         console.log(
    //           storeFront[key]?.collectionId === value,
    //           storeFront[key]
    //         );
    //         return storeFront[key]?.collectionId === value;
    //       });
    //       if (!key) {
    //         return;
    //       }
    //       storeFront[key] = {
    //         ...storeFront[key],
    //         products: storeFront[key].products.map((storeFrontProduct) => {
    //           console.log(
    //             storeFrontProduct._id.toString() !== _id,
    //             "storeFrontssssss"
    //           );
    //           if (storeFrontProduct._id.toString() === _id) {
    //             return { ...storeFrontProduct, ...rest };
    //           }
    //           return storeFrontProduct;
    //         }),
    //       };
    //     });
    //   }
    //      }
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
  // console.log(JSON.stringify(storeFront), "storeFront");
  // await client
  //   .db("base")
  //   .collection("storeFronts")
  //   .updateOne(
  //     { _id: new ObjectId(storeId) },
  //     {
  //       $set: {
  //         ...storeFront,
  //       },
  //     }
  //   );
  await client.db('base').collection('products').bulkWrite(updateQuery);
  return result;
};
interface BulkUpdateProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx, callback) => {
  // turnOffCallbackAwaitForEmptyEventLoop(ctx);
  // const client = await getMongoClientWithIAMRole();
  // const arg = JSON.parse(event.body);
  // const { accessToken, userId } = arg[arg.length - 1];
  // await mainValidateFunction(client, accessToken, userId);
  const response = await mainWrapper({ ctx, event, callback, mainFunction: bulkUpdateHandler });
  return response;
};
