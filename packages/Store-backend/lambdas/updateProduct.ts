('use strict');
import { MainFunctionProps, mainWrapper, tCollections_products } from 'hyfn-server';

import { deleteImages } from './common/utils/deleteImages';
import { sql } from 'kysely';

interface UpdateProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const updateProductHandler = async ({ arg, client, db, userId }: UpdateProductProps) => {
  const response = await db.transaction().execute(async (trx) => {
    const { product, productId, deletedImages } = arg[0];

    const {
      title,
      description,
      price,
      prevPrice,
      currency,
      barcode,
      measurementSystem,
      weightInKilo,
      hasOptions,
      options,
      isActive,
      imagesURLs: urls,

      collections,
    } = product;

    const { id, country, city } = arg[1];

    var returnValue = 'initial';
    const mongo = client;

    const oldProductDoc = await trx
      .selectFrom('products')
      .selectAll()
      .where('id', '=', productId)
      .executeTakeFirstOrThrow();
    const oldCollections = await db
      .selectFrom('collectionsProducts')
      .selectAll()
      .where('productId', '=', productId)
      .execute();

    const addedCollections = collections.filter((collection) => {
      const oldCollectionExist = oldCollections.find((oldCollection) => {
        return oldCollection.collectionId === collection.value;
      });

      if (oldCollectionExist) {
        return false;
      }
      return true;
    });

    const removedCollections = oldCollections.filter((newCollection) => {
      const oldCollectionExist = collections.find(
        (oldCollection) => oldCollection.value === newCollection.collectionId
      );

      if (oldCollectionExist) {
        return false;
      }
      return true;
    });

    if (addedCollections.length > 0) {
      const newCollections = addedCollections.map((collection) => ({
        collectionId: collection.value,
        productId,
      }));
      await trx.insertInto('collectionsProducts').values(newCollections).execute();
    }
    if (removedCollections.length > 0) {
      const removedRelationsRowsIds = removedCollections.map((relation) => relation.id);

      await trx
        .deleteFrom('collectionsProducts')
        .where(sql`id in (${sql.join(removedRelationsRowsIds)})`)
        .execute();
    }

    const updatedImages = oldProductDoc?.images?.filter(
      (image) => !deletedImages?.some((deletedImage) => deletedImage === image)
    );
    const whiteBackgroundImages = oldProductDoc?.whiteBackgroundImages?.filter(
      (oldWhiteImage) => !deletedImages.includes(oldWhiteImage)
    );
    if (deletedImages?.length > 0) {
      await deleteImages(deletedImages);
    }
    // if (removeBackgroundImages?.length > 0) {
    //   removeBackgrounds({ keys: removeBackgroundImages, storeId: id });
    // }

    const images =
      Array.isArray(updatedImages) && Array.isArray(urls)
        ? [...urls, ...updatedImages]
        : !Array.isArray(updatedImages) && Array.isArray(urls)
        ? [...urls, updatedImages]
        : Array.isArray(updatedImages) && !Array.isArray(urls)
        ? [urls, ...updatedImages]
        : [urls, updatedImages];

    const imagesURLs = images;

    await trx
      .updateTable('products')
      .set({
        title: title,
        description: description,
        price: price,
        prevPrice: prevPrice,
        options: options,
        hasOptions: hasOptions,
        isActive,
        images: imagesURLs,
        whiteBackgroundImages,
        measurementSystem,
      })
      .where('id', '=', productId)
      .execute();

    returnValue = 'success';

    return { message: returnValue };
  });

  return response;
};

export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: updateProductHandler,
  });
};
