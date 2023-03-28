'use strict';

import { mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx, callback) => {
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };

  const mainFunction = async ({ arg, client }) => {
    // await subscriptionCheck({ storedoc: userDocument, client, session, storeId: userDocument._id });
    var result;
    const product = arg[0];
    const {
      textInfo,
      pricing,
      barcode,
      measurementSystem,
      weightInKilo,
      options,
      isActive,
      imagesURLs,
      collections,
    } = product;
    const { storeFrontId, id, country, city } = arg[1];
    console.log(product, 'vbvbvbvbvv');

    const images = imagesURLs;

    const mongo = client;
    const storeDoc = await mongo
      .db(`generalData`)
      .collection(`storeInfo`)
      .findOne({ _id: new ObjectId(id) }, {});

    // if (storeDoc.userId !== privateId) {
    //   throw "unathenticated request";
    // }

    // const storeFrontDoc = await findOne(
    //   { _id: new ObjectId(storeFrontId) },
    //   { session },
    //   mongo.db("base").collection(`storeFronts`)
    // );

    console.log(JSON.stringify(collections));
    const modifiedOptions = options?.options?.map((option) => {
      option?.optionValues;
      return option;
    });
    if (storeDoc.collections?.length >= 1) {
      console.log('something');

      if (collections.collectionType === 'automated') {
        const automatedCollections = storeDoc?.collections?.filter((collection) => {
          return collection.collectionType === 'automated';
        });

        const matchesCollections = automatedCollections?.filter((collection) => {
          let matches = [];

          collection.conditionS.conditionArray.forEach((condition, index) => {
            const keys = condition.objectKey.split('.');

            if (keys.length === 2) {
              matches.push(product[`${keys[0]}`][`${keys[1]}`] === condition.value);
            } else {
              matches.push(product[`${keys[0]}`] === condition.value);
            }
          });

          if (
            matches.includes(false) &&
            matches.includes(true) &&
            collection.conditionS.mustMatch === '$or'
          ) {
            return true;
          }
          if (
            !matches.includes(false) &&
            matches.includes(true) &&
            (collection.conditionS.mustMatch === '$and' ||
              collection.conditionS.mustMatch === '$or')
          ) {
            return true;
          }
        });

        const reducedCollections = matchesCollections.map((collection) => {
          return { label: collection.textInfo.title, value: collection.id };
        });

        console.log(JSON.stringify(reducedCollections));

        const newProduct = await mongo
          .db('base')
          .collection(`products`)
          .insertOne(
            {
              textInfo,
              pricing,
              barcode: barcode.trim(),
              weightInKilo,
              measurementSystem,
              options: { ...options, options: modifiedOptions },
              isActive,
              storeId: id,
              city,
              collections: [...collections, ...reducedCollections],
              images: images,
            },
            {}
          );
        // createIndex({collection: 'products', database: country, index: 'productSearch', mappings: {
        // dynamic: false,
        // fields: {
        //   textInfo: {
        //     type: 'document',
        //     fields: {
        //       title: {
        //         type: 'document',
        //         dynamic: true
        //       },
        //       description: {
        //         type: 'document',
        //         dynamic: true
        //       }
        //     }
        //   }
        // }
        // }})
        //   client.index(`${country}_${city}_products`).addDocument({
        //     id: newProduct.insertedId,
        //     title: textInfo.title,
        //     description: textInfo.description,
        //     price: pricing.price,
        //     storeId: id,
        //   });

        // if (isActive) {
        //   console.log("here", storeFrontId);
        //   await [...collections, ...reducedCollections].map(
        //     async (storeFront) => {
        //       const { label } = storeFront;
        //       if (!(storeFront[`${label}`]?.products?.length > 20)) {
        //         await mongo
        //           .db("base")
        //           .collection(`storeFronts`)
        //           .updateOne(
        //             { _id: new ObjectId(storeFrontId) },
        //             {
        //               $push: {
        //                 [`${label}.products`]: {
        //                   textInfo,
        //                   _id: newProduct.insertedId,
        //                   pricing,
        //                   measurementSystem,
        //                   images: images,
        //                   hasOptions: options.hasOptions,
        //                 },
        //               },
        //             },
        //             { session }
        //           );
        //       }
        //       // client.index(`${country}_${city}_products`).addDocument({
        //       //   id: newProduct.insertedId,
        //       //   title: textInfo.title,
        //       //   description: textInfo.description,
        //       //   price: pricing.price,
        //       //   storeId: id,
        //       // });
        //     }
        //   );
        // }
      }

      const newProduct = await mongo
        .db('base')
        .collection(`products`)
        .insertOne(
          {
            textInfo,
            barcode,
            pricing,

            weightInKilo,
            options: { ...options, options: modifiedOptions },
            measurementSystem,
            isActive,
            collections: collections?.length > 0 ? collections : [],
            storeId: id,
            city,
            images: images,
          },
          {}
        );

      // if (isActive) {
      //   console.log("here", storeFrontId);
      //   await [...collections].map(async (storeFront) => {
      //     const { label, value } = storeFront;

      //     if (!(storeFront[`${label}`]?.products?.length > 0)) {
      //       await mongo
      //         .db("base")
      //         .collection(`storeFronts`)
      //         .updateOne(
      //           { _id: new ObjectId(storeFrontId) },
      //           {
      //             $set: {
      //               [`${label}.collectionName`]: label,
      //               [`${label}.collectionId`]: value,
      //             },
      //           },
      //           { session }
      //         );
      //     }
      //     // if (!(storeFront[`${label}`]?.products?.length > 20)) {
      //     //   await mongo
      //     //     .db("base")
      //     //     .collection(`storeFronts`)
      //     //     .updateOne(
      //     //       { _id: new ObjectId(storeFrontId) },
      //     //       {
      //     //         $push: {
      //     //           [`${label}.products`]: {
      //     //             textInfo,
      //     //             _id: newProduct.insertedId,
      //     //             pricing,
      //     //             measurementSystem,
      //     //             images: images,
      //     //             hasOptions: options.hasOptions,
      //     //           },
      //     //         },
      //     //       },
      //     //       { session }
      //     //     );
      //     // }
      //   });
      //   //   client.index(`${country}_${city}_products`).addDocument({
      //   //     id: newProduct.insertedId,
      //   //     title: textInfo.title,
      //   //     description: textInfo.description,
      //   //     price: pricing.price,
      //   //     storeId: id,
      //   //   });
      // }

      result = newProduct.insertedId.toString();
    } else {
      const newProduct = await mongo
        .db('base')
        .collection(`products`)
        .insertOne(
          {
            textInfo,
            pricing,
            barcode,

            weightInKilo,
            options: { ...options, options: modifiedOptions },
            measurementSystem,
            collections: collections?.length > 0 ? collections : [],
            isActive,
            storeId: id,
            city,
            images: images,
          },
          {}
        );

      result = newProduct.insertedId.toString();
    }

    console.log(result);
    return result;
  };

  return await mainWrapperWithSession({
    mainFunction,
    ctx,
    callback,
    event,
    sessionPrefrences: transactionOptions,
  });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
