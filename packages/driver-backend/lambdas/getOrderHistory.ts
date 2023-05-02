export const getOrderHistoryHandler = async ({ arg, client }) => {
    var result;
    const { driverId, country, lastDoc } = arg[0];
    if (lastDoc) {
        result = await client
            .db('base')
            .collection('orders')
            .find({
            _id: { $gt: new ObjectId(lastDoc) },
            status: { $elemMatch: { _id: driverId, status: USER_STATUS_DELIVERED } },
        })
            .limit(20)
            .toArray();
        return result;
    }
    result = await client
        .db('base')
        .collection('orders')
        .find({
        status: { $elemMatch: { _id: driverId, status: USER_STATUS_DELIVERED } },
    })
        .limit(20)
        .toArray();
    return result;
};
interface GetOrderHistoryProps extends Omit<MainFunctionProps, 'arg'> {
    arg: any;
}
('use strict');
import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { USER_STATUS_DELIVERED } from '../common/constants';
export const handler = async (event) => {
    return await mainWrapper({ event, mainFunction: getOrderHistoryHandler });
};
