interface GetDriverInfoProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { ObjectId } from 'mongodb';
import { MainFunctionProps } from 'hyfn-server/src';
import { findOne, mainWrapper } from 'hyfn-server/src';

export const GetDriverInfo = async ({ arg, client }: MainFunctionProps) => {
  const { driverId } = arg[0];
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ _id: new ObjectId(driverId) });
  findOne({ findOneResult: driverDoc });
  return driverDoc;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: GetDriverInfo });
};
