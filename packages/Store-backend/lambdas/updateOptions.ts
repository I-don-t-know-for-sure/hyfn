('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
interface UpdateOptionsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const updateOptionsHandler = async ({ arg, client, userId }: UpdateOptionsProps) => {
  var result;
  const { storeId, country, productsArray } = arg[0];
  const validatedArray = productsArray;
  // schema validations
  const updateQuery = validatedArray?.map((product) => {
    const { id, ...rest } = product;
    const options = rest.options.options;
    return {
      updateOne: {
        filter: {
          id: new ObjectId(product.id),
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

  await client.db('base').collection('products').bulkWrite(updateQuery);
  return result;
};
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: updateOptionsHandler });
};
