export const disableLocalCardKeysHandler = async ({
  arg,
  client,
  userId,
  db,
}: MainFunctionProps) => {
  await db
    .updateTable('driverManagements')
    .set({
      localCardKeyFilled: false,
    })
    .where('userId', '=', userId)
    .execute();
};
interface DisableLocalCardKeysProps extends Omit<MainFunctionProps, 'arg'> {}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: disableLocalCardKeysHandler });
};
