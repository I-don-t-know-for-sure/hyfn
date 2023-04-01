export const getAllCollectionsHandler = async ({ arg, client }) => {
  console.log(event);
  console.log(arg);
  const { id, country, city } = arg[0];
  console.log('🚀 ~ file: getAllCollections.js ~ line 15 ~ mainFunction ~ id', id);
  // await argValidations(arg);
  const storeDoc = await client
    .db('generalData')
    .collection(`storeInfo`)
    .findOne({ _id: new ObjectId(id) }, {});
  return storeDoc.collections;
};
interface GetAllCollectionsProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getAllCollectionsHandler });
};
