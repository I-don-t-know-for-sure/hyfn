export const getDriverInfoHandler = async ({ arg, client, db }: MainFunctionProps) => {
  const { driverId } = arg[0];

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('id', '=', driverId)
    .executeTakeFirstOrThrow();
  return driverDoc;
};
interface GetDriverInfoProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getDriverInfoHandler });
};
