import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { sendRemoveBackgroundsEventBus } from './common/functions/removeBackgrounds';

import AWS, { S3 } from 'aws-sdk';

interface RemoveAllProductsBackgroundsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const removeAllProductsBackgroundsHandler = async ({
  arg,
}: RemoveAllProductsBackgroundsProps) => {
  const { productIds, storeId } = arg[0];
  const imageKeys = [];

  // for (const productId of productIds) {
  //   const product = await client
  //     .db('base')
  //     .collection('products')
  //     .findOne({ _id: new ObjectId(productId) }, { projection: { _id: false, images: true } });
  //   imageKeys.push(...product.images);
  // }
  // console.log(
  //   '🚀 ~ file: removeAllProductsBackgrounds.ts:15 ~ imageKeys:',
  //   process.env.backgroundRemovalEventBus
  // );

  sendRemoveBackgroundsEventBus({ productIds, storeId });

  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: removeAllProductsBackgroundsHandler });
};