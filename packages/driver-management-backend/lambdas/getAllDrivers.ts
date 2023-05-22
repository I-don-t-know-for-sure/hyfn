import { MainFunctionProps, mainWrapper } from 'hyfn-server';

interface GetAllDriversProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const getAllDriversHandler = async ({ arg, client, db }: GetAllDriversProps) => {
  const { managementId } = arg[0];

  const drivers = await db
    .selectFrom('drivers')
    .selectAll()
    .where('driverManagement', '=', managementId)
    .execute();
  return drivers.map((driver) => ({ label: driver.driverName, value: driver.id }));
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getAllDriversHandler });
};
