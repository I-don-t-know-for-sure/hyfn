import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { removeBackgrounds } from '../common/functions/removeBackgrounds';

interface RemoveAllProductsBackgroundsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const removeAllProductsBackgroundsHandler = async ({
  arg,
  client,
}: RemoveAllProductsBackgroundsProps) => {
  const { productIds } = arg[0];
  const imageKeys = [];

  for (const productId of productIds) {
    const product = await client
      .db('base')
      .collection('products')
      .findOne({ _id: new ObjectId(productId) }, { projection: { _id: false, images: true } });
    imageKeys.push(...product.images);
  }
  console.log('🚀 ~ file: removeAllProductsBackgrounds.ts:15 ~ imageKeys:', imageKeys);

  removeBackgrounds({ keys: imageKeys });
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: removeAllProductsBackgroundsHandler });
};
