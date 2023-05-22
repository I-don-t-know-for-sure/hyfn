export const updateManagementInfoHandler = async ({
  arg,
  client,
  session,
  userId,
  db,
}: MainFunctionProps) => {
  const { balance, usedBalance, ...newInfo } = arg[0];
  // const newCut = parseFloat(newInfo.managementCut);

  const userDocument = await db
    .selectFrom('driverManagements')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  const { /*managementCut*/ id } = userDocument;
  // const newManagementCut = newCut
  //   ? newCut === 1
  //     ? 1
  //     : newCut >= MAXIMUM_MANAGEMENT_CUT
  //     ? MAXIMUM_MANAGEMENT_CUT
  //     : newCut
  //   : managementCut;
  const driverManagementId = id.toString();
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

  await db
    .updateTable('driverManagements')
    .set({
      country: newInfo.country,
      managementAddress: newInfo.managementAddress,
      managementName: newInfo.managementName,
      managementPhone: newInfo.managementPhone,
      verified: true,
    })
    .where('userId', '=', userId)
    .executeTakeFirst();
  return 'seccess';
};
interface UpdateManagementInfoProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import {
  MainFunctionProps,
  mainWrapper,
  tDriverManagement,
  tDriverManagements,
  takeFisrtOrThrow,
  takeMany,
  zDriverManagement,
} from 'hyfn-server';
import { MAXIMUM_MANAGEMENT_CUT } from 'hyfn-types';
import { sql } from 'kysely';
const { equal } = require('mathjs');
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: updateManagementInfoHandler,
  });
};
