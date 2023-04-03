export const getStoreDocumentHandler = async ({ arg, client }) => {
  var result;
  const { userId } = arg[0];
  result = await client.db('generalData').collection('storeInfo').findOne({ userId }, {});
  // await subscriptionCheck({ storedoc: result, client, storeId: result._id });
  console.log(result);
  return result;
};
interface GetStoreDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getStoreDocumentHandler });
};
