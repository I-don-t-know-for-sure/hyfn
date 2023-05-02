'use strict';
import { ObjectId } from 'mongodb';

import { mainValidateFunction } from '../common/authentication';
import { getMongoClientWithIAMRole } from '../common/mongodb';
import { findOne } from '../common/mongoUtils/findOne';
import { insertOne } from '../common/mongoUtils/insertOne';
export const handler = async (event) => {
  try {
    const client = await getMongoClientWithIAMRole();
    const arg = JSON.parse(event.body);
    const storeInfo = arg[0];

    const { country, city, storeId, customerId, productId } = storeInfo;
    const { accessToken } = arg[1];
    await mainValidateFunction(client, accessToken, customerId);
    console.log(JSON.stringify({ country, city, storeId, customerId }));
    // add prefrnce
    const session = client.startSession();
    session.startTransaction();

    try {
      const mongo = client;

      const generalDb = mongo.db('generalData');

      const db = mongo.db('base');

      const productInfo = await findOne(
        { _id: new ObjectId(productId) },
        {},
        db.collection(`products`)
      );

      const targetedDocument = await findOne(
        { _id: new ObjectId(storeId) },
        {},
        db.collection('storeData')
      );
      const targetedCustomerDoc = await findOne(
        {
          _id: new ObjectId(customerId),
        },
        {},
        generalDb.collection('customerData')
      );
      // a document for this store already exists in storeData collection so we only need to update
      const productLikeCount = productInfo.likes;
      if (targetedCustomerDoc) {
        // if the user previosly liked a product , else they didnt and it means that the product will gain a like
        if (
          Array.isArray(targetedCustomerDoc?.likedProducts) &&
          targetedCustomerDoc?.likedProducts?.length > 0
        ) {
          const didCustomerLikeProduct = targetedCustomerDoc.likedProducts.find(
            (id) => productId === id._id
          );

          console.log(JSON.stringify(didCustomerLikeProduct), 121221);
          // customer already liked so this is to unlike
          if (didCustomerLikeProduct) {
            console.log('update');
            console.log(storeId, productId);
            await db.collection(`storeData`).updateOne(
              {
                '_id': new ObjectId(storeId),

                'likedProducts._id': productId,
              },
              {
                $set: {
                  'likedProducts.$.likeCount': productLikeCount > 0 ? productLikeCount - 1 : 0,
                },
              }
            );

            var queryDoc = { _id: new ObjectId(storeId) };
            productInfo?.collections?.forEach((collection) => {
              queryDoc = {
                ...queryDoc,
                [`${collection?.label}._id`]: new ObjectId(productId),
              };
            });
            var updateDoc = {};

            productInfo?.collections?.forEach((collection) => {
              updateDoc = {
                ...updateDoc,
                [`${collection.label}.$.likes`]: productLikeCount > 0 ? productLikeCount - 1 : 0,
              };
            });

            await db.collection(`storeFronts`).updateOne(queryDoc, {
              $set: updateDoc,
            });
            console.log(81);
            await db.collection(`products`).updateOne(
              { _id: new ObjectId(productId) },
              {
                $set: {
                  likes: productLikeCount > 0 ? productLikeCount - 1 : 0,
                },
              }
            );
            console.log(88);

            await generalDb.collection('customerData').updateOne(
              { _id: new ObjectId(customerId) },
              {
                $pull: { likedProducts: { _id: productId } },
              }
            );
            console.log(103);
            return;
          } else {
            if (targetedDocument) {
              if (
                Array.isArray(targetedDocument?.likedProducts) &&
                targetedDocument?.likedProducts?.length > 0
              ) {
                const isProductLiked = targetedDocument?.likedProducts?.find(
                  (product) => product._id === productId
                );
                if (isProductLiked) {
                  console.log(106);
                  await db.collection(`storeData`).updateOne(
                    {
                      '_id': new ObjectId(storeId),

                      'likedProducts._id': productId,
                    },
                    {
                      $set: {
                        'likedProducts.$.likeCount': productLikeCount + 1,
                      },
                    }
                  );
                  /*begin */
                  var queryDoc = { _id: new ObjectId(storeId) };
                  productInfo?.collections?.forEach((collection) => {
                    queryDoc = {
                      ...queryDoc,
                      [`${collection?.label}._id`]: new ObjectId(productId),
                    };
                  });
                  var updateDoc = {};

                  productInfo?.collections?.forEach((collection) => {
                    updateDoc = {
                      ...updateDoc,
                      [`${collection.label}.$.likes`]: productLikeCount + 1,
                    };
                  });

                  await db.collection(`storeFronts`).updateOne(queryDoc, {
                    $set: updateDoc,
                  });

                  await db.collection(`products`).updateOne(
                    { _id: new ObjectId(productId) },
                    {
                      $set: {
                        likes: productLikeCount + 1,
                      },
                    }
                  );
                  await generalDb.collection(`customerData`).updateOne(
                    {
                      _id: new ObjectId(customerId),
                    },
                    {
                      $push: {
                        likedProducts: { _id: productId, storeId: storeId },
                      },
                    }
                  );
                  // await generalDb.collection("customerData").updateOne(
                  //   { _id: new ObjectId(customerId) },
                  //   {
                  //     $push: { likedProducts: { _id: productId, storeId } },
                  //   }
                  // );
                  /* end */
                  return;
                }
              }
              await db.collection(`storeData`).updateOne(
                {
                  _id: new ObjectId(storeId),
                },
                {
                  $push: {
                    likedProducts: { _id: productId, likeCount: 1 },
                  },
                }
              );

              /*begin */
              var queryDoc = { _id: new ObjectId(storeId) };
              productInfo?.collections?.forEach((collection) => {
                queryDoc = {
                  ...queryDoc,
                  [`${collection?.label}._id`]: new ObjectId(productId),
                };
              });
              var updateDoc = {};

              productInfo?.collections?.forEach((collection) => {
                updateDoc = {
                  ...updateDoc,
                  [`${collection.label}.$.likes`]: 1,
                };
              });

              await db.collection(`storeFronts`).updateOne(queryDoc, {
                $set: updateDoc,
              });

              await db.collection(`products`).updateOne(
                { _id: new ObjectId(productId) },
                {
                  $set: {
                    likes: 1,
                  },
                }
              );
              await generalDb.collection(`customerData`).updateOne(
                {
                  _id: new ObjectId(customerId),
                },
                {
                  $push: {
                    likedProducts: { _id: productId, storeId: storeId },
                  },
                }
              );
              // await generalDb.collection("customerData").updateOne(
              //   { _id: new ObjectId(customerId) },
              //   {
              //     $push: { likedProducts: { _id: productId, storeId } },
              //   }
              // );
              /* end */

              return;
            }
          }
          console.log(163);
          return;
        } else {
          console.log(98);
          await generalDb.collection(`customerData`).updateOne(
            { _id: new ObjectId(customerId) },
            {
              $set: { likedProducts: [{ _id: productId, storeId: storeId }] },
            }
          );

          if (targetedDocument) {
            if (
              Array.isArray(targetedDocument?.likedProducts) &&
              targetedDocument?.likedProducts?.length > 0
            ) {
              const likedProduct = targetedDocument?.likedProducts?.find((product) => {
                return product._id === productId;
              });

              if (likedProduct) {
                await db.collection(`storeData`).updateOne(
                  {
                    '_id': new ObjectId(storeId),

                    'likedProducts._id': productId,
                  },
                  {
                    $set: {
                      'likedProducts.$.likeCount': likedProduct.likeCount + 1,
                    },
                  }
                );

                var queryDoc = { _id: new ObjectId(storeId) };
                productInfo?.collections?.forEach((collection) => {
                  queryDoc = {
                    ...queryDoc,
                    [`${collection?.label}._id`]: new ObjectId(productId),
                  };
                });
                var updateDoc = {};

                productInfo?.collections?.forEach((collection) => {
                  updateDoc = {
                    ...updateDoc,
                    [`${collection.label}.$.likes`]: likedProduct.likeCount + 1,
                  };
                });

                await db.collection(`storeFronts`).updateOne(queryDoc, {
                  $set: updateDoc,
                });

                await db.collection(`products`).updateOne(
                  { _id: new ObjectId(productId) },
                  {
                    $set: {
                      likes: likedProduct.likeCount + 1,
                    },
                  }
                );
              } else {
                await db.collection(`storeData`).updateOne(
                  {
                    _id: new ObjectId(storeId),
                  },
                  {
                    $push: {
                      likedProducts: { _id: productId, likeCount: 1 },
                    },
                  }
                );

                var queryDoc = { _id: new ObjectId(storeId) };
                // productInfo?.collections?.forEach((collection) => {
                //   queryDoc = {
                //     ...queryDoc,
                //     [`${collection?.label}._id`]: new ObjectId(productId),
                //   };
                // });
                var updateDoc = {};

                productInfo?.collections?.forEach((collection) => {
                  updateDoc = {
                    ...updateDoc,
                    [`${collection.label}.$.likes`]: 1,
                  };
                });

                await db.collection(`storeFronts`).updateOne(queryDoc, {
                  $set: updateDoc,
                });

                await db.collection(`products`).updateOne(
                  { _id: new ObjectId(productId) },
                  {
                    $set: {
                      likes: 1,
                    },
                  }
                );
              }
              console.log(268);
              return;
            } else {
              console.log(storeId);
              await db.collection(`storeData`).updateOne(
                {
                  _id: new ObjectId(storeId),
                },
                {
                  $push: {
                    likedProducts: { _id: productId, likeCount: 1 },
                  },
                }
              );

              var queryDoc = { _id: new ObjectId(storeId) };
              productInfo?.collections?.forEach((collection) => {
                queryDoc = {
                  ...queryDoc,
                  [`${collection?.label}._id`]: new ObjectId(productId),
                };
              });
              var updateDoc = {};

              productInfo?.collections?.forEach((collection) => {
                updateDoc = {
                  ...updateDoc,
                  [`${collection.label}.$.likes`]: 1,
                };
              });

              await db.collection(`storeFronts`).updateOne(queryDoc, {
                $set: updateDoc,
              });

              await db.collection(`products`).updateOne(
                { _id: new ObjectId(productId) },
                {
                  $set: {
                    likes: 1,
                  },
                }
              );
            }
            console.log(313);
            return;
          } else {
            await insertOne({
              insertDocument: {
                _id: new ObjectId(storeId),
                likedProducts: [{ _id: productId, likeCount: 1 }],
              },
              options: {},
              collection: db.collection('storeData'),
            });
          }
          var queryDoc = { _id: new ObjectId(storeId) };
          productInfo?.collections?.forEach((collection) => {
            queryDoc = {
              ...queryDoc,
              [`${collection?.label}._id`]: new ObjectId(productId),
            };
          });
          var updateDoc = {};
          console.log(329);
          productInfo?.collections?.forEach((collection) => {
            updateDoc = {
              ...updateDoc,
              [`${collection.label}.$.likes`]: productLikeCount + 1,
            };
          });

          await db.collection(`storeFronts`).updateOne(queryDoc, {
            $set: updateDoc,
          });

          await db.collection(`products`).updateOne(
            { _id: new ObjectId(productId) },
            {
              $set: {
                likes: productLikeCount + 1,
              },
            }
          );
          console.log(349);
          // await generalDb.collection("customerData").updateOne(
          //   { _id: new ObjectId(customerId) },
          //   {
          //     $push: { likedProducts: { _id: productId, storeId } },
          //   }
          // );
        }
        // console.log(98);
        // await generalDb.collection(`customerData`).updateOne(
        //   {
        //     _id: new ObjectId(customerId),
        //   },
        //   {
        //     $push: { likedProducts: { _id: productId, storeId: storeId } },
        //   }
        // );
        // // check if the document exists
        // if (targetedDocument) {
        //   console.log(109);
        //   await db.collection(`storeData`).updateOne(
        //     {
        //       _id: new ObjectId(storeId),
        //     },
        //     {
        //       $push: { likedProducts: { _id: productId, likeCount: 1 } },
        //     }
        //   );
        //   var queryDoc = { _id: new ObjectId(storeId) };
        // productInfo?.collections?.forEach((collection) => {
        //   queryDoc = {
        //     ...queryDoc,
        //     [`${collection?.label}._id`]: new ObjectId(productId),
        //   };
        // });
        // var updateDoc = {};

        // productInfo?.collections?.forEach((collection) => {
        //   updateDoc = {
        //     ...updateDoc,
        //     [`${collection.label}.$.likes`]: 1,
        //   };
        // });

        // // requires more details
        // await db.collection(`${city}__storeFronts`).updateOne(queryDoc, updateDoc);
        // } else {
        //   console.log(126);
        //   await db.collection("storeData").insertOne({
        //     _id: new ObjectId(storeId),
        //     $push: { likedProducts: { _id: productId, likeCount: 1 } },
        //   });
        //   // requires more details
        //   //   await db.collection(`${city}__storeFronts`).updateOne(
        //   //     {
        //   //       _id: new ObjectId(storeId),
        //   //     },
        //   //     {}
        //   //   );
        // }

        // return;
      } else {
        await insertOne({
          insertDocument: {
            _id: new ObjectId(customerId),
            likedProducts: [{ _id: productId, storeId: storeId }],
          },
          options: {},
          collection: generalDb.collection(`customerData`),
        });

        if (targetedDocument) {
          await db.collection(`storeData`).updateOne(
            {
              '_id': new ObjectId(storeId),

              'likedProducts._id': productId,
            },
            {
              $set: {
                'likedProducts.$.likeCount': productLikeCount + 1,
              },
            }
          );

          var queryDoc = { _id: new ObjectId(storeId) };
          productInfo?.collections?.forEach((collection) => {
            queryDoc = {
              ...queryDoc,
              [`${collection?.label}._id`]: new ObjectId(productId),
            };
          });
          var updateDoc = {};

          productInfo?.collections?.forEach((collection) => {
            updateDoc = {
              ...updateDoc,
              [`${collection.label}.$.likes`]: productLikeCount + 1,
            };
          });

          await db.collection(`storeFronts`).updateOne(queryDoc, {
            $set: updateDoc,
          });

          await db.collection(`products`).updateOne(
            { _id: new ObjectId(productId) },
            {
              $set: {
                likes: productLikeCount + 1,
              },
            }
          );
          return;
        } else {
          await insertOne({
            insertDocument: {
              _id: new ObjectId(storeId),
              likedProducts: [{ _id: productId, likeCount: 1 }],
            },
            options: {},
            collection: db.collection('storeData'),
          });
        }
        var queryDoc = { _id: new ObjectId(storeId) };
        productInfo?.collections?.forEach((collection) => {
          queryDoc = {
            ...queryDoc,
            [`${collection?.label}._id`]: new ObjectId(productId),
          };
        });
        var updateDoc = {};

        productInfo?.collections?.forEach((collection) => {
          updateDoc = {
            ...updateDoc,
            [`${collection.label}.$.likes`]: productLikeCount + 1,
          };
        });

        await db.collection(`storeFronts`).updateOne(queryDoc, {
          $set: updateDoc,
        });

        await db.collection(`products`).updateOne(
          { _id: new ObjectId(productId) },
          {
            $set: {
              likes: productLikeCount + 1,
            },
          }
        );
      }

      return;
    } catch (error) {
      await session.abortTransaction();
      return new Error(error.message);
    } finally {
      await session.commitTransaction();
      await session.endSession();

      return JSON.stringify({});
    }
  } catch (e) {
    return new Error(e.message);
  }
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
