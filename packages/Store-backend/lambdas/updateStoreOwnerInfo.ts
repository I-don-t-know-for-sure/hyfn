export const updateStoreOwnerInfoHandler = async ({
  arg,
  client,
  db,
  userId,
}: MainFunctionProps) => {
  var result;

  const newInfo = arg[1];
  const { imgaeObj, ...newStore } = newInfo;

  await db
    .updateTable('stores')
    .set({
      ownerFirstName: newStore.ownerFirstName,
      ownerLastName: newStore.ownerLastName,
      ownerPhoneNumber: newStore.ownerPhoneNumber,
      storeOwnerInfoFilled: true,
    })
    .where('userId', '=', userId)
    .execute();
};
interface UpdateStoreOwnerInfoProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');

import { MainFunctionProps, mainWrapper } from 'hyfn-server';

export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: updateStoreOwnerInfoHandler,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
};
