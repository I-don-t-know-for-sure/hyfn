export const searchDriverByIdHandler = async ({ arg, client, db }: MainFunctionProps) => {
  const { driverId } = arg[0];

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('id', '=', driverId)
    .executeTakeFirstOrThrow();
  return driverDoc;
};
interface SearchDriverByIdProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  const result = await mainWrapper({ event, mainFunction: searchDriverByIdHandler });
  return result;
};
