interface GetProductProps extends Omit<MainFunctionProps, "arg"> {
}
'use strict';
import { ObjectId } from 'mongodb';
import { MainFunctionProps } from 'hyfn-server/src';
import { findOne, mainWrapper } from 'hyfn-server/src';
interface GetProductProps extends Omit<MainFunctionProps, 'arg'> {
    arg: any[];
    arg: any;
}
const getProduct = async ({ arg, client }: GetProductProps) => {
    var result;
    const { storefront, productId, city, country } = arg[0];
    const withStoreDoc = arg[1];
    const mongo = client.db('base');
    if (withStoreDoc) {
        const product = await mongo.collection(`products`).findOne({ _id: new ObjectId(productId), storeId: storefront }, {
            projection: {
                shipping: 0,
                collections: 0,
                inventory: 0,
                city: 0,
            },
        });
        findOne({ findOneResult: product });
        const storeDoc = await mongo
            .collection(`storeFronts`)
            .findOne({ _id: new ObjectId(storefront) });
        findOne({ findOneResult: storeDoc });
        result = { product, storeDoc };
        return result;
    }
    const product = await mongo.collection(`products`).findOne({ _id: new ObjectId(productId), storeId: storefront }, {
        projection: {
            shipping: 0,
            collections: 0,
            inventory: 0,
            city: 0,
        },
    });
    findOne({ findOneResult: product });
    result = product;
    return result;
    // Ensures that the client will close when you finish/error
};
export const handler = async (event) => {
    return await mainWrapper({ event, mainFunction: getProduct });
    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
