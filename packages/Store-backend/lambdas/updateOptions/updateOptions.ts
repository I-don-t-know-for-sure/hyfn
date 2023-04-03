export const updateOptionsHandler = async ({ arg, client }) => {
  var result;
  const { storeId, country, productsArray } = arg[0];
  const validatedArray = productsArray;
  // schema validations
  const updateQuery = validatedArray?.map((product) => {
    const { _id, ...rest } = product;
    const options = rest.options.options;
    return {
      updateOne: {
        filter: {
          _id: new ObjectId(product._id),
        },
        update: {
          $set: {
            options: {
              hasOptions: options.length > 0,
              options,
            },
          },
        },
      },
    };
  });
  console.log(updateQuery);
  await client.db('base').collection('products').bulkWrite(updateQuery);
  return result;
};
interface UpdateOptionsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: updateOptionsHandler });
};
