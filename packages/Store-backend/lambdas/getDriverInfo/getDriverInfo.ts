export const getDriverInfoHandler = async ({ arg, client }) => {
  const { driverId } = arg[0];
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ _id: new ObjectId(driverId) }, {});
  return driverDoc;
};
interface GetDriverInfoProps extends Omit<MainFunctionProps, 'arg'> {}
import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getDriverInfoHandler });
};
