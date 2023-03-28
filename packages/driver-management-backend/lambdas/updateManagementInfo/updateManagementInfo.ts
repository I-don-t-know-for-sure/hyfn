import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { MAXIMUM_MANAGEMENT_CUT } from 'hyfn-types';

const { equal } = require('mathjs');

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, session, userId }: MainFunctionProps) => {
    const { balance, usedBalance, ...newInfo } = arg[0];
    // const newCut = parseFloat(newInfo.managementCut);
    const userDocument = await client
      .db('generalData')
      .collection('driverManagement')
      .findOne({ userId }, { session });
    const { /*managementCut*/ _id } = userDocument;

    // const newManagementCut = newCut
    //   ? newCut === 1
    //     ? 1
    //     : newCut >= MAXIMUM_MANAGEMENT_CUT
    //     ? MAXIMUM_MANAGEMENT_CUT
    //     : newCut
    //   : managementCut;

    const driverManagementId = _id.toString();

    //     if (
    //       !equal(
    //         parseFloat(newManagementCut.toFixed(2)),
    //         parseInt(managementCut))
    //       )
    //      {
    //       await client.db('generalData').collection('drivers').updateMany( { driverManagement: driverManagementId },
    //  {
    //           $set: {
    //             managementCut: parseFloat(newManagementCut.toFixed(2)),
    //           },
    //         },
    //  { session },

    //       );
    //     }

    await client
      .db('generalData')
      .collection('driverManagement')
      .updateOne(
        { userId },

        {
          $set: {
            ...newInfo,
            userId,
            // managementCut: parseFloat(newManagementCut.toFixed(2)),
          },
        },
        { session }
      );
    return 'seccess';
  };

  return await mainWrapper({
    event,
    mainFunction,
  });
};
