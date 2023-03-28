import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ACCEPTED_PROPOSALS_FLAG } from 'hyfn-types';
import { ObjectId } from 'mongodb';

interface GetAcceptedProposalsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

const getProposals = async ({ arg, client, userId }: GetAcceptedProposalsProps) => {
  const { country, driverManagementId, lastDoc, flag } = arg[0];
  const queryDoc =
    flag === ACCEPTED_PROPOSALS_FLAG
      ? {
          acceptedProposal: driverManagementId,
        }
      : {
          proposalsIds: driverManagementId,
        };
  console.log('🚀 ~ file: getProposals.ts:12 ~ getProposals ~ queryDoc:', queryDoc);
  if (lastDoc) {
    const result = await client
      .db('base')
      .collection('orders')
      .find({
        _id: { $gt: new ObjectId(lastDoc) },
        ...queryDoc,
      })
      .limit(10)
      .toArray();
    return result;
  }

  const result = await client
    .db('base')
    .collection('orders')
    .find({
      ...queryDoc,
    })
    .limit(10)
    .toArray();
  return result;
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getProposals });
};
