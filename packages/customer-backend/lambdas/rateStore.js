'use strict';
import { ObjectId } from 'mongodb';

import { updateRating, addRating } from './common/utils';
import { mainValidateFunction } from './common/authentication';
import { findOne } from './common/mongoUtils/findOne';
import { getMongoClientWithIAMRole } from './common/mongodb';
import { mainWrapperWithSession } from './common/mainWrapperWithSession';
import { insertOne } from './common/mongoUtils/insertOne';
export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    var result = 'initial';
    const storeInfo = arg[0];

    const { country, city, storeId, customerId, rating } = storeInfo;

    console.log(JSON.stringify({ country, city, storeId, customerId, rating }));

    const mongo = client;

    const generalDb = mongo.db('generalData');

    const db = mongo.db('base');
    const targetedDocument = await findOne(
      { _id: new ObjectId(storeId) },
      {},
      generalDb.collection('storeData')
    );
    const targetedCustomerDoc = await findOne(
      {
        _id: new ObjectId(customerId),
      },
      {},
      generalDb.collection('customerData')
    );

    if (targetedCustomerDoc) {
      if (
        Array.isArray(targetedCustomerDoc?.storeRatings) &&
        targetedCustomerDoc?.storeRatings?.length > 0
      ) {
        var oldRating = 0;
        const didCustomerRateStore = targetedCustomerDoc?.storeRatings.some((rating) => {
          if (rating._id == storeId) {
            oldRating = rating.rating;
          }
          return rating._id === storeId;
        });

        if (didCustomerRateStore) {
          const { currentRatingTotal, ratingCount } = targetedDocument;

          const {
            currentRating: newCurrentRating,
            currentRatingTotal: newCurrentRatigTotal,
            ratingCount: newRatingCount,
          } = updateRating(
            currentRatingTotal ? currentRatingTotal : 0,
            ratingCount ? ratingCount : 0,
            rating,
            oldRating ? oldRating : 0
          );
          console.log(
            currentRatingTotal,
            ratingCount,
            rating,
            oldRating,
            newCurrentRating,
            newCurrentRatigTotal
          );
          console.log(64, storeId);
          await generalDb.collection(`storeData`).updateOne(
            {
              '_id': new ObjectId(storeId),

              'ratings._id': customerId,
            },
            {
              $set: {
                'currentRating': newCurrentRating,
                'currentRatingTotal': newCurrentRatigTotal,
                'ratingCount': newRatingCount,
                'ratings.$.rating': rating,
              },
            }
          );

          await db.collection(`storeFronts`).updateOne(
            {
              _id: new ObjectId(storeId),
            },
            {
              $set: {
                ratingCount: newRatingCount,
                currentRatingTotal: newCurrentRatigTotal,
                currentRating: newCurrentRating,
              },
            }
          );

          await generalDb.collection('customerData').updateOne(
            {
              '_id': new ObjectId(customerId),
              'storeRatings._id': storeId,
            },
            {
              $set: { 'storeRatings.$.rating': rating },
            }
          );
          console.log(1);
          return;
        }
      }

      await generalDb.collection(`customerData`).updateOne(
        {
          _id: new ObjectId(customerId),
        },
        {
          $push: { storeRatings: { _id: storeId, rating } },
        }
      );

      if (targetedDocument) {
        const { currentRatingTotal, ratingCount } = targetedDocument;

        const {
          currentRating: newCurrentRating,
          currentRatingTotal: newCurrentRatigTotal,
          ratingCount: newRatingCount,
        } = addRating(
          currentRatingTotal ? currentRatingTotal : 0,
          ratingCount ? ratingCount : 0,
          rating
        );

        await generalDb.collection(`storeData`).updateOne(
          {
            _id: new ObjectId(storeId),
          },
          {
            $set: {
              currentRating: newCurrentRating,
              currentRatingTotal: newCurrentRatigTotal,
              ratingCount: newRatingCount,
            },

            $push: { ratings: { _id: customerId, rating } },
          }
        );

        await db.collection(`storeFronts`).updateOne(
          {
            _id: new ObjectId(storeId),
          },
          {
            $set: {
              currentRating: newCurrentRating,
              currentRatingTotal: newCurrentRatigTotal,
              ratingCount: newRatingCount,
            },
          }
        );
      } else {
        await insertOne({
          insertDocument: {
            _id: new ObjectId(storeId),
            currentRating: rating,
            currentRatingTotal: rating,
            ratingCount: 1,
            ratings: [{ _id: customerId, rating }],
          },
          options: {},
          collection: generalDb.collection('storeData'),
        });

        await db.collection(`storeFronts`).updateOne(
          {
            _id: new ObjectId(storeId),
          },
          {
            $set: {
              currentRating: rating,
              currentRatingTotal: rating,
              ratingCount: 1,
            },
          }
        );
      }

      return;
    } else {
      await generalDb.collection(`customerData`).insertOne({
        _id: new ObjectId(customerId),
        storeRatings: [{ _id: storeId, rating }],
      });

      if (targetedDocument) {
        const { currentRatingTotal, ratingCount } = targetedDocument;

        const {
          currentRating: newCurrentRating,
          currentRatingTotal: newCurrentRatigTotal,
          ratingCount: newRatingCount,
        } = addRating(
          currentRatingTotal ? currentRatingTotal : 0,
          ratingCount ? ratingCount : 0,
          rating
        );
        console.log(newCurrentRatigTotal, newCurrentRating);
        await generalDb.collection(`storeData`).updateOne(
          {
            _id: new ObjectId(storeId),
          },
          {
            $set: {
              currentRating: newCurrentRating,
              currentRatingTotal: newCurrentRatigTotal,
              ratingCount: newRatingCount,
            },

            $push: { ratings: { _id: customerId, rating } },
          }
        );

        await db.collection(`storeFronts`).updateOne(
          {
            _id: new ObjectId(storeId),
          },
          {
            $set: {
              currentRating: newCurrentRating,
              currentRatingTotal: newCurrentRatigTotal,
              ratingCount: newRatingCount,
            },
          }
        );
      } else {
        await generalDb.collection('storeData').insertOne({
          _id: new ObjectId(storeId),
          currentRating: rating,
          currentRatingTotal: rating,
          ratingCount: 1,
          ratings: [{ _id: customerId, rating }],
        });

        await db.collection(`storeFronts`).updateOne(
          {
            _id: new ObjectId(storeId),
          },
          {
            $set: {
              currentRating: rating,
              currentRatingTotal: rating,
              ratingCount: 1,
            },
          }
        );
      }
      console.log(3);
    }

    return { message: result };
  };
  return await mainWrapperWithSession({
    mainFunction,

    event,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
