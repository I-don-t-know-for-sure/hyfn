export const getTrustedDriversHandler = async ({ arg, client, userId }: MainFunctionProps) => {
    const userDocument = await client
        .db('generalData')
        .collection('driverManagement')
        .findOne({ userId }, {
        projection: {
            _id: 1,
        },
    });
    const { _id } = userDocument;
    const driverManagementId = _id.toString();
    const { storeId, lastDoc } = arg[0];
    if (lastDoc) {
        const result = await client
            .db('generalData')
            .collection('driverData')
            .find({
            $and: [{ _id: { $gt: new ObjectId(lastDoc) }, driverManagement: driverManagementId }],
        })
            .limit(20)
            .toArray();
        return result;
    }
    const result = await client
        .db('generalData')
        .collection('driverData')
        .find({ driverManagement: driverManagementId })
        .limit(20)
        .toArray();
    return result;
};
interface GetTrustedDriversProps extends Omit<MainFunctionProps, 'arg'> {
    arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
    const result = await mainWrapper({ event, mainFunction: getTrustedDriversHandler });
    return result;
};
