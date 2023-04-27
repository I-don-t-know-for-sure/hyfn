('use strict');
interface CreateProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';

export const createProductHandler = async ({ arg, client, userId }: CreateProductProps) => {
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

  console.log(product, 'vbvbvbvbvv');
  const images = imagesURLs;
  const mongo = client;
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ usersIds: userId }, {});
  if (!storeDoc) throw new Error('store not found');
  const id = storeDoc._id.toString();
  const city = storeDoc.city;

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
          (collection.conditionS.mustMatch === '$and' || collection.conditionS.mustMatch === '$or')
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
export const handler = async (event, ctx, callback) => {
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  return await mainWrapperWithSession({
    mainFunction: createProductHandler,
    ctx,
    callback,
    event,
    sessionPrefrences: transactionOptions,
  });
};
