export const getDriverInfoHandler = async ({ arg, client, db }: MainFunctionProps) => {
  const { driverId } = arg[0];

  const driver = await db
    .selectFrom('drivers')
    .selectAll()
    .where('id', '=', driverId)
    .executeTakeFirstOrThrow();
  return driver;
};
interface GetDriverInfoProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}

import { MainFunctionProps, mainWrapper } from 'hyfn-server';

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getDriverInfoHandler });
};
