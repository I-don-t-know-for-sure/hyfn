interface GetProposalsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ACCEPTED_PROPOSALS_FLAG } from 'hyfn-types';
import { sql } from 'kysely';
import { ObjectId } from 'mongodb';
interface GetAcceptedProposalsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
const getProposals = async ({ arg, client, userId, db }: GetAcceptedProposalsProps) => {
  const { country, driverManagementId, lastDoc, flag } = arg[0];
  const queryDoc =
    flag === ACCEPTED_PROPOSALS_FLAG
      ? {
          acceptedProposal: driverManagementId,
        }
      : {
          acceptedProposal: { $exists: false },
          proposalsIds: driverManagementId,
        };
  console.log('🚀 ~ file: getProposals.ts:12 ~ getProposals ~ queryDoc:', queryDoc);

  const orders = await db
    .selectFrom('orders')
    .select('proposals')
    .where('proposalsIds', '@>', sql`array[${sql.join([driverManagementId])}]`)
    .limit(10)
    .execute();
  return orders;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getProposals });
};
