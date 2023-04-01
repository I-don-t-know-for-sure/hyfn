export const getProductFromBarcodeHandler = async ({ arg, client }) => {
  var result;
  const { searchString } = arg[0];
  const products = await client
    .db('productsLibrary')
    .collection('products')
    .find({ barcode: searchString }, { projection: { ['textInfo.title']: 1, images: 1 } })
    .limit(20)
    .toArray();
  result = products;
  return result;
};
interface GetProductFromBarcodeProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { mainWrapper } from 'hyfn-server';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getProductFromBarcodeHandler });
};
