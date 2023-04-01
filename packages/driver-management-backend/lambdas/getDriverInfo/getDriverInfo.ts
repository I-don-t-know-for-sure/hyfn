export const getDriverInfoHandler = async ({ arg, client }) => {
  const { driverId } = arg[0];
  const driver = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ _id: new ObjectId(driverId) }, {});
  return driver;
};
interface GetDriverInfoProps extends Omit<MainFunctionProps, 'arg'> {}
import { mainWrapper } from 'hyfn-server';
const { ObjectId } = require('mongodb');
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getDriverInfoHandler });
};
