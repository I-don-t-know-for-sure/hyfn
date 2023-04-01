interface GetDriverInfoProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { mainWrapper } from 'hyfn-server';

const { ObjectId } = require('mongodb');

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    const { driverId } = arg[0];
    const driver = await client
      .db('generalData')
      .collection('driverData')
      .findOne({ _id: new ObjectId(driverId) }, {});

    return driver;
  };

  return await mainWrapper({ event, mainFunction });
};
