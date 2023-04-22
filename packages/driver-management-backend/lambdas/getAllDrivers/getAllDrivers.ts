import { MainFunctionProps, mainWrapper } from 'hyfn-server';

interface GetAllDriversProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const getAllDriversHandler = async ({ arg, client }: GetAllDriversProps) => {
  const { managementId } = arg[0];
  const drivers = await client
    .db('generalData')
    .collection('driverData')
    .find({ driverManagement: managementId })
    .toArray();

  return drivers.map((driver) => ({ label: driver.driverName, value: driver._id.toString() }));
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getAllDriversHandler });
};
