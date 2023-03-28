'use strict';
// canceled
import { getMongoClientWithIAMRole } from '../common/mongodb';
import { getCountryInfo } from '../common/utils';
export const handler = async (event, ctx) => {
  var result;

  const client = await getMongoClientWithIAMRole();

  try {
    // const stores = await client.db('generalData').collection('storeInfo').find({}).toArray()

    // for(let i = 0; i < stores.length;  i++){

    // }

    const { countries } = getCountryInfo();

    for (let i = 0; i < countries.length; i++) {
      const storesWithExpiredSubscription = await client
        .db('generalData')
        .collection('storeInfo')
        .find(
          {
            'subscriptionInfo.expirationDate': {
              $lte: new Date(),
            },
            'country': countries[i],
          },
          {
            projection: { _id: 1 },
          }
        )
        .toArray();

      for (let x = 0; x < storesWithExpiredSubscription.length; x++) {}
    }
  } catch (error) {
    result = error.message;
  } finally {
    return JSON.stringify(result);
  }

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
