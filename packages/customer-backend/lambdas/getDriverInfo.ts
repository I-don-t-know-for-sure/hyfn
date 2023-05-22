interface GetDriverInfoProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { MainFunctionProps } from 'hyfn-server/src';
import { findOne, mainWrapper } from 'hyfn-server/src';
export const GetDriverInfo = async ({ arg, client, db }: MainFunctionProps) => {
  const { driverId } = arg[0];

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('id', '=', driverId)
    .executeTakeFirstOrThrow();
  return driverDoc;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: GetDriverInfo });
};
