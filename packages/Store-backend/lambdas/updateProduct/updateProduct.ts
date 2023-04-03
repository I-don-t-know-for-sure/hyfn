export const updateProductHandler = async ({ arg, client, session }: MainFunctionProps) => {
  const product = arg[0];
  const {
    textInfo,
    pricing,
    barcode,
    measurementSystem,
    weightInKilo,
    options,
    isActive,
    imagesURLs: urls,
    collections,
  } = product;
  const { id, country, city } = arg[1];
  const productId = arg[2];
  const deletedImages = arg[3];
  var returnValue = 'initial';
  const mongo = client;
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ _id: new ObjectId(id) }, { session });
  const oldProductDoc = await mongo
    .db('base')
    .collection(`products`)
    .findOne({ _id: new ObjectId(productId) }, { session });
  // const storeFront = await findOne(
  //   { _id: new ObjectId(id) },
  //   { session },
  //   mongo.db("base").collection(`storeFronts`)
  // );
  console.log(storeDoc);
  const updatedImages = oldProductDoc?.images?.filter(
    (image) => !deletedImages?.some((deletedImage) => deletedImage === image)
  );
  if (deletedImages?.length > 0) {
    await deleteImages(deletedImages);
  }
  const images =
    Array.isArray(updatedImages) && Array.isArray(urls)
      ? [...urls, ...updatedImages]
      : !Array.isArray(updatedImages) && Array.isArray(urls)
      ? [...urls, updatedImages]
      : Array.isArray(updatedImages) && !Array.isArray(urls)
      ? [urls, ...updatedImages]
      : [urls, updatedImages];
  // const modifiedOptions = options.options.map((option) => {
  //   option.optionValues.pop();
  //   return option;
  // });
  const imagesURLs = images;
  if (storeDoc.collections?.length >= 1) {
    // await mongo.db("base").collection(`products`).updateOne({_id: new ObjectId(productId)}, {
    //  textInfo, pricing, inventory,measurementSystem, weightInKilo,, options, isActive, imagesURLs, collections
    //})
    console.log('filter  29');
    const automatedCollections = storeDoc?.collections?.filter((collection) => {
      return collection.collectionType === 'automated';
    });
    console.log('filter 35');
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
        (collection.conditionS.mustMatch === '$and' || collection.conditionS.mustMatch === '$or')
      ) {
        return true;
      }
    });
    const reducedCollection = matchesCollections.map((collection) => {
      if (
        collections.includes({
          label: collection.textInfo.title,
          value: collection.id,
        })
      )
        return;
      return { label: collection.textInfo.title, value: collection.id };
    });
    console.log('filter 83');
    const unmatchedCollections = oldProductDoc.collections.filter((oldCollection) => {
      return ![...collections, ...reducedCollection].some(
        (collection) => collection.value === oldCollection.value
      );
    });
    console.log('filter 89');
    const oldMatchedCollections = [...collections, ...reducedCollection].filter((collection) => {
      return oldProductDoc.collections.some(
        (oldCollection) => oldCollection.value === collection.value
      );
    });
    console.log('filter 94');
    const newMatchedCollections = [...collections, ...reducedCollection].filter((collection) => {
      return !oldProductDoc.collections.some(
        (oldCollection) => oldCollection.value === collection.value
      );
    });
    for (let i = 0; i < unmatchedCollections.length; i++) {
      const collection = unmatchedCollections[i];
      // }
      //           await unmatchedCollections.map(async (collection) => {
      // if (storeFront[collection.label]?.products?.length === 1) {
      //   await mongo
      //     .db("base")
      //     .collection(`storeFronts`)
      //     .updateOne(
      //       { _id: new ObjectId(id) },
      //       {
      //         $unset: { [`${collection.label}`]: "" },
      //       },
      //       {
      //         session,
      //       }
      //     );
      //   continue;
      // }
      // await mongo
      //   .db("base")
      //   .collection(`storeFronts`)
      //   .updateOne(
      //     {
      //       _id: new ObjectId(storeFrontId),
      //       [`${collection.label}.products._id`]: new ObjectId(productId),
      //     },
      //     {
      //       $pull: {
      //         [`${collection.label}.products`]: {
      //           _id: { $eq: new ObjectId(productId) },
      //         },
      //       },
      //     },
      //     { session }
      //   );
    }
    if (isActive && oldProductDoc.isActive) {
      console.log(
        JSON.stringify({
          oldMatchedCollections,
          newMatchedCollections,
          unmatchedCollections,
        }),
        'hellooooo'
      );
      // for (let i = 0; i < oldMatchedCollections?.length; i++) {
      //   const storeFront = oldMatchedCollections[i];
      //   const { label, value } = storeFront;
      //   // }
      //   // await oldMatchedCollections.map(async (storeFront) => {
      //   //   const { label, value } = storeFront;
      //   const oldCollectionFromStoreDoc = storeDoc.collections.find(
      //     (oldCollection) => {
      //       return oldCollection._id === value;
      //     }
      //   );
      //   if (oldCollectionFromStoreDoc?.isActive) {
      //     await mongo
      //       .db("base")
      //       .collection(`storeFronts`)
      //       .updateOne(
      //         {
      //           _id: new ObjectId(storeFrontId),
      //           [`${label}.products._id`]: new ObjectId(productId),
      //         },
      //         {
      //           $set: {
      //             [`${label}.products.$`]: {
      //               textInfo,
      //               _id: new ObjectId(productId),
      //               pricing,
      //               measurementSystem,
      //               images: imagesURLs,
      //               hasOptions: options.hasOptions,
      //             },
      //           },
      //         },
      //         { session }
      //       );
      //   }
      // }
      // for (let i = 0; i < newMatchedCollections.length; i++) {
      //   const storeFront = newMatchedCollections[i];
      //   const { label, value } = storeFront;
      //   const oldCollectionFromStoreDoc = storeDoc.collections.find(
      //     (oldCollection) => {
      //       return oldCollection._id === value;
      //     }
      //   );
      //   if (oldCollectionFromStoreDoc.isActive) {
      //     if (
      //       !(storeFront[`${label}`]?.products?.length > 20) &&
      //       storeFront[`${label}`]?.products?.length > 0
      //     ) {
      //       await mongo
      //         .db("base")
      //         .collection(`storeFronts`)
      //         .updateOne(
      //           { _id: new ObjectId(storeFrontId) },
      //           {
      //             $push: {
      //               [`${label}.products`]: {
      //                 textInfo,
      //                 _id: new ObjectId(productId),
      //                 pricing,
      //                 measurementSystem,
      //                 images: imagesURLs,
      //                 hasOptions: options.hasOptions,
      //               },
      //             },
      //             $set: {
      //               [`${label}`]: {
      //                 collectionName: label,
      //                 collectionId: value,
      //               },
      //             },
      //           },
      //           { session }
      //         );
      //     }
      //     if (!(storeFront[`${label}`]?.products?.length > 0)) {
      //       await mongo
      //         .db("base")
      //         .collection(`storeFronts`)
      //         .updateOne(
      //           { _id: new ObjectId(storeFrontId) },
      //           {
      //             $set: {
      //               [`${label}`]: {
      //                 collectionName: label,
      //                 collectionId: value,
      //                 products: [
      //                   {
      //                     textInfo,
      //                     _id: new ObjectId(productId),
      //                     pricing,
      //                     measurementSystem,
      //                     images: imagesURLs,
      //                     hasOptions: options.hasOptions,
      //                   },
      //                 ],
      //               },
      //             },
      //           },
      //           { session }
      //         );
      //     }
      //   }
      // }
    }
    /*
                          await mongo
                          .db("base")
                          .collection(`${city}__storeFronts`)
                      .updateOne(
                        { _id: new ObjectId(storeFrontId) },
                        {
                          $set: {
                            [`${label}`]: {
                              collectionName: label,
                              collectionId: value,
                              products: {
                                textInfo,
                                _id: new ObjectId(productId),
                                pricing,
                                measurementSystem,
                                images: imagesURLs,
                                hasOptions: options.hasOptions,
                              },
                            },
                          },
                        },
                        { session }
                        );
                        
                        */
    // if (isActive && !oldProductDoc.isActive) {
    //   console.log("filter 139");
    //   const bothCollections = [
    //     ...newMatchedCollections,
    //     ...oldMatchedCollections,
    //   ];
    //   for (let i = 0; i < bothCollections.length; i++) {
    //     const storeFront = bothCollections[i];
    //     const { label, value } = storeFront;
    //     const oldCollectionFromStoreDoc = storeDoc.collections.find(
    //       (oldCollection) => {
    //         return oldCollection._id === value;
    //       }
    //     );
    //     if (oldCollectionFromStoreDoc.isActive) {
    //       if (
    //         !(storeFront[`${label}`]?.products?.length > 20) &&
    //         storeFront[`${label}`]?.products?.length > 0
    //       ) {
    //         await mongo
    //           .db("base")
    //           .collection(`storeFronts`)
    //           .updateOne(
    //             { _id: new ObjectId(storeFrontId) },
    //             {
    //               $push: {
    //                 [`${label}.products`]: {
    //                   textInfo,
    //                   _id: new ObjectId(productId),
    //                   pricing,
    //                   measurementSystem,
    //                   images: imagesURLs,
    //                   hasOptions: options.hasOptions,
    //                 },
    //               },
    //             },
    //             { session }
    //           );
    //         continue;
    //       }
    //       if (!(storeFront[`${label}`]?.products?.length > 0)) {
    //         await mongo
    //           .db("base")
    //           .collection(`storeFronts`)
    //           .updateOne(
    //             { _id: new ObjectId(storeFrontId) },
    //             {
    //               $set: {
    //                 [`${label}`]: {
    //                   collectionName: label,
    //                   collectionId: value,
    //                   products: [
    //                     {
    //                       textInfo,
    //                       _id: new ObjectId(productId),
    //                       pricing,
    //                       measurementSystem,
    //                       images: imagesURLs,
    //                       hasOptions: options.hasOptions,
    //                     },
    //                   ],
    //                 },
    //               },
    //             },
    //             { session }
    //           );
    //       }
    //     }
    //   }
    //   // console.log(245);
    //   // await mongo
    //   //   .db("base")
    //   //   .collection(`products`)
    //   //   .updateOne(
    //   //     { _id: new ObjectId(productId) },
    //   //     {
    //   //       $set: {
    //   //         textInfo: textInfo,
    //   //         pricing: pricing,
    //   //         weightInKilo,: weightInKilo,,
    //   //         measurementSystem: measurementSystem,
    //   //         options: { ...options, options: modifiedOptions },
    //   //         isActive: isActive,
    //   //         storeId: id,
    //   //         city: city,
    //   //         collections: collections,
    //   //         images: imagesURLs,
    //   //       },
    //   //     },
    //   //     {
    //   //       session,
    //   //     }
    //   //   );
    // }
    console.log(269);
    // if (!isActive && oldProductDoc.isActive) {
    //   console.log(273);
    //   for (let i = 0; i < collections.length; i++) {
    //     const collection = collections[i];
    //     if (storeFront[`${collection.label}`].products?.length > 1) {
    //       await mongo.collection(`storeFronts`).updateOne(
    //         { _id: new ObjectId(id) },
    //         {
    //           $pull: {
    //             [`${collection.label}.products`]: {
    //               _id: new ObjectId(productId),
    //             },
    //           },
    //         },
    //         { session }
    //       );
    //       console.log(289);
    //       returnValue = "success";
    //       continue;
    //     }
    //     await mongo
    //       .db("base")
    //       .collection(`storeFronts`)
    //       .updateOne(
    //         { _id: new ObjectId(id) },
    //         {
    //           $unset: { [`${collection.label}`]: "" },
    //         },
    //         {
    //           session,
    //         }
    //       );
    //     console.log(306);
    //   }
    //   console.log(310);
    // await mongo
    //   .db("base")
    //   .collection(`products`)
    //   .updateOne(
    //     { _id: new ObjectId(productId) },
    //     {
    //       $set: {
    //         textInfo: textInfo,
    //         pricing,
    //         inventory,
    //         weightInKilo,,
    //         options: { ...options, options: modifiedOptions },
    //         measurementSystem,
    //         collections,
    //         isActive,
    //         storeId: id,
    //         city,
    //         images: imagesURLs,
    //       },
    //     },
    //     {
    //       session,
    //     }
    //   );
    // console.log(332);
    // returnValue = "success";
    // return;
    //}
    // if (!isActive && !oldProductDoc.isActive) {
    //   console.log(340);
    //   await mongo
    //     .db("base")
    //     .collection(`products`)
    //     .updateOne(
    //       { _id: new ObjectId(productId) },
    //       {
    //         $set: {
    //           textInfo: textInfo,
    //           pricing,
    //           inventory,
    //           weightInKilo,,
    //           options: { ...options, options: modifiedOptions },
    //           measurementSystem,
    //           isActive,
    //           collections,
    //           storeId: id,
    //           city,
    //           images: imagesURLs,
    //         },
    //       },
    //       {
    //         session,
    //       }
    //     );
    //   console.log(360);
    //   returnValue = "success";
    //   return;
    // }
    // await mongo
    //   .db("base")
    //   .collection(`products`)
    //   .updateOne(
    //     { _id: new ObjectId(productId) },
    //     {
    //       $set: {
    //         textInfo: textInfo,
    //         pricing,
    //         inventory,
    //         weightInKilo,,
    //         measurementSystem,
    //         options: { ...options, options: modifiedOptions },
    //         isActive,
    //         storeId: id,
    //         city,
    //         collections,
    //         images: imagesURLs,
    //       },
    //     },
    //     {
    //       session,
    //     }
    //   );
    // console.log(387);
    // returnValue = "success";
    // return;
  }
  await mongo
    .db('base')
    .collection(`products`)
    .updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          textInfo: textInfo,
          pricing,
          barcode: barcode.trim(),
          weightInKilo,
          options,
          measurementSystem,
          isActive,
          collections,
          storeId: id,
          city,
          images: imagesURLs,
        },
      },
      {
        session,
      }
    );
  console.log(414);
  returnValue = 'success';
  return { message: returnValue };
};
interface UpdateProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { deleteImages } from '../common/utils/deleteImages';
export const handler = async (event, ctx) => {
  return await mainWrapperWithSession({
    event,
    ctx,
    mainFunction: updateProductHandler,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
};
