interface ValidateTransactionProps extends Omit<MainFunctionProps, "arg"> {
    arg: any;
}
import { ObjectId } from 'mongodb';
import { ORDER_TYPE_PICKUP, STORE_STATUS_PAID } from 'hyfn-types';
import { MainFunctionProps } from 'hyfn-server/src';
import { decryptData, findOne, isLocalCardTransactionValidated, mainWrapperWithSession, updateOne, } from 'hyfn-server/src';
import { kmsClient } from '../../common/getKMSClient';
import { kmsKeyARN } from '../../common/kmsKeyARN';
interface validateStoreLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
    arg: any[];
}
export const validateStoreLocalCardTransaction = async ({ arg, client, session, }: validateStoreLocalCardTransactionProps) => {
    const { transactionId, country } = arg[0];
    const transaction = await client
        .db('generalData')
        .collection('transactions')
        .findOne({ _id: new ObjectId(transactionId) }, {});
    findOne({ findOneResult: transaction });
    if (!transaction) {
        throw '';
    }
    if (transaction.approved) {
        return 'transaction already approved';
    }
    const storeDoc = await client
        .db('generalData')
        .collection('storeInfo')
        .findOne({ _id: new ObjectId(transaction.storeId) }, {});
    findOne({ findOneResult: storeDoc });
    if (!storeDoc) {
        throw '';
    }
    const { TerminalId, MerchantId, secretKey: encryptedSecretKey } = storeDoc.localCardAPIKey;
    const secretKey = await decryptData({
        data: encryptedSecretKey,
        kmsClient: kmsClient,
        kmsKeyARN: kmsKeyARN,
    });
    const isApproved = await isLocalCardTransactionValidated({
        includeLocalCardTransactionFeeToPrice: storeDoc.includeLocalCardFeeToPrice,
        transactionId,
        MerchantId,
        secretKey,
        TerminalId,
        amount: transaction.amount,
    });
    if (isApproved) {
        // const customerDocUpdate = await client
        //   .db('generalData')
        //   .collection('customerInfo')
        //   .updateOne(
        //     { _id: new ObjectId(transaction.customerId) },
        //     {
        //       $set: {
        //         balance: -Math.abs(transaction.amount),
        //       },
        //     }
        //   );
        // updateOne({ updateOneResult: customerDocUpdate });
        const orderDoc = await client
            .db('base')
            .collection('orders')
            .findOne({ _id: new ObjectId(transaction.orderId) }, {});
        findOne({ findOneResult: orderDoc });
        var updateDoc = {
            [`orders.$[store].transactions.$[transaction].validated`]: true,
            [`orders.$[store].paid`]: true,
            [`orders.$[store].orderStatus`]: STORE_STATUS_PAID,
            // ['status.$[customer].status']: ORDER_STATUS_DELIVERED,
            [`orders.$[store].paymentDate`]: new Date(),
            // ['status.$[store].status']: ORDER_STATUS_DELIVERED,
        } as any;
        if (!orderDoc) {
            throw '';
        }
        if (orderDoc.orderType === ORDER_TYPE_PICKUP) {
            const storesNotPaid = orderDoc.orders.some((store) => {
                return !store.paid;
            });
            if (!storesNotPaid) {
                updateDoc = { ...updateDoc, delivered: true };
            }
        }
        const updateOrderDoc = await client
            .db('base')
            .collection('orders')
            .updateOne({ _id: new ObjectId(transaction.orderId) }, {
            $set: updateDoc,
        }, {
            session,
            arrayFilters: [
                {
                    'store._id': new ObjectId(transaction.storeId),
                },
                { 'transaction._id': new ObjectId(transaction._id.toString()) },
            ],
        });
        updateOne({ updateOneResult: updateOrderDoc });
        await client
            .db('generalData')
            .collection('transactions')
            .updateOne({ _id: new ObjectId(transactionId) }, {
            $set: { validated: true },
        }, { session });
        // if (transaction.amountToReturnToCustomer && transaction.amountToReturnToCustomer > 0.0) {
        const customerInfoUpdate = await client
            .db('generalData')
            .collection('customerInfo')
            .updateOne({
            _id: new ObjectId(transaction.customerId),
        }, {
            $set: {
                transactionId: undefined,
            },
            ...(transaction.amountToReturnToCustomer && transaction.amountToReturnToCustomer > 0.0
                ? {
                    $inc: {
                        balance: Math.abs(transaction.amountToReturnToCustomer),
                    },
                }
                : {}),
        }, { session });
        updateOne({ updateOneResult: customerInfoUpdate });
        // }
        const storeInfoUpdate = await client
            .db('generalData')
            .collection('storeInfo')
            .updateOne({ _id: new ObjectId(transaction.storeId) }, {
            $inc: {
                sales: Math.abs(transaction.amount),
            },
        }, { session });
        updateOne({ updateOneResult: storeInfoUpdate });
        return 'transaction approved';
    }
    return 'transaction not approved yet or not found';
};
export const handler = async (event) => {
    return await mainWrapperWithSession({ event, mainFunction: validateStoreLocalCardTransaction });
};
