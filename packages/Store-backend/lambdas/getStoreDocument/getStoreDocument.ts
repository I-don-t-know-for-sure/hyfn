('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
interface GetStoreDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const getStoreDocumentHandler = async ({ client, userId }: GetStoreDocumentProps) => {
  var result;

  result = await client.db('generalData').collection('storeInfo').findOne({ usersIds: userId }, {});
  if (!result) throw new Error('Store not found');

  return { ...result /* userType: result.users[userId].userType */ };
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getStoreDocumentHandler });
};
