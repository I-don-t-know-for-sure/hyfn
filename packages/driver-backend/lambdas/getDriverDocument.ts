export const getDriverDocumentHandler = async ({ arg, client, db }: MainFunctionProps) => {
  const { userId } = arg[0];

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  return driverDoc;
};
interface GetDriverDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getDriverDocumentHandler });
};
