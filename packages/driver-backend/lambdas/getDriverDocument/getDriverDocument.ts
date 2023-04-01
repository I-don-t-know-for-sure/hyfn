interface GetDriverDocumentProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }: MainFunctionProps) => {
    var result;
    const { userId } = arg[0];
    console.log(userId);

    result = await client.db('generalData').collection('driverData').findOne({
      driverId: userId,
    });
    console.log(result);
    return result;

    // Ensures that the client will close when you finish/error
  };
  return await mainWrapper({ event, mainFunction });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
