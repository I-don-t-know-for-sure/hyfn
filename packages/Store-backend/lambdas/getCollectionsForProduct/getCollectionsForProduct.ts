export const getCollectionsForProductHandler = async ({ arg, client }) => {
  var result;
  const { id, country, city } = arg[0];
  const storeDoc = await client
    .db('generalData')
    .collection(`storeInfo`)
    .findOne({ _id: new ObjectId(id) }, {});
  const reducedCollections = storeDoc.collections
    .filter((collection) => {
      return collection.collectionType !== 'automated';
    })
    .map((collection) => {
      console.log(JSON.stringify({ value: collection._id }));
      return { label: collection.textInfo.title, value: collection._id };
    });
  return reducedCollections;
};
interface GetCollectionsForProductProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getCollectionsForProductHandler });
};
