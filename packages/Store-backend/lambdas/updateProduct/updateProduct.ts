('use strict');
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { deleteImages } from '../common/utils/deleteImages';
import { removeBackgrounds } from '../common/functions/removeBackgrounds';
interface UpdateProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
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
    removeBackgroundImages,
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
  if (removeBackgroundImages?.length > 0) {
    removeBackgrounds({ keys: removeBackgroundImages });
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

    const unmatchedCollections = oldProductDoc.collections.filter((oldCollection) => {
      return ![...collections, ...reducedCollection].some(
        (collection) => collection.value === oldCollection.value
      );
    });

    const oldMatchedCollections = [...collections, ...reducedCollection].filter((collection) => {
      return oldProductDoc.collections.some(
        (oldCollection) => oldCollection.value === collection.value
      );
    });

    const newMatchedCollections = [...collections, ...reducedCollection].filter((collection) => {
      return !oldProductDoc.collections.some(
        (oldCollection) => oldCollection.value === collection.value
      );
    });
    for (let i = 0; i < unmatchedCollections.length; i++) {
      const collection = unmatchedCollections[i];
    }
    if (isActive && oldProductDoc.isActive) {
    }
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
