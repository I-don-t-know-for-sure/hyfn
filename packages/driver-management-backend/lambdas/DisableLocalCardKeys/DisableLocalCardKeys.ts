export const disableLocalCardKeysHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  await client
    .db('generalData')
    .collection('driverManagement')
    .updateOne(
      { userId },
      {
        $set: {
          localCardAPIKeyFilled: false,
        },
      },
      {}
    );
};
interface DisableLocalCardKeysProps extends Omit<MainFunctionProps, 'arg'> {}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: disableLocalCardKeysHandler });
};
