export const setProductAsNotFoundHandler = async ({ arg, client }) => {
    var result;
    const { productId, productKey, storeId, country, driverId } = arg[0];
    const driverDoc = await client
        .db('generalData')
        .collection('driverData')
        .findOne({
        _id: new ObjectId(driverId),
    }, {});
    const { orderId } = driverDoc;
    const orderDoc = await client
        .db('base')
        .collection('orders')
        .findOne({ _id: new ObjectId(orderId) }, {});
    if (!orderDoc.serviceFeePaid) {
        throw new Error('service fee not paid yet');
    }
    await client
        .db('base')
        .collection('orders')
        .updateOne({
        _id: new ObjectId(orderId),
    }, {
        $set: {
            [`orders.$[store].addedProducts.$[product].pickup`]: {
                pickedUp: false,
                QTYFound: 0,
            },
        },
    }, {
        arrayFilters: [{ 'store._id': new ObjectId(storeId) }, { 'product.key': productKey }],
    });
    result = 'success';
    return result;
};
interface SetProductAsNotFoundProps extends Omit<MainFunctionProps, 'arg'> {
    arg: any;
}
('use strict');
import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
    return await mainWrapper({ event, mainFunction: setProductAsNotFoundHandler });
};
