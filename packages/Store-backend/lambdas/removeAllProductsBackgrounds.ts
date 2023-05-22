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

  sendRemoveBackgroundsEventBus({ productIds, storeId });

  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: removeAllProductsBackgroundsHandler });
};
