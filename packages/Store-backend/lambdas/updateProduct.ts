("use strict");
import {
  MainFunctionProps,
  mainWrapper,
  tCollections_products
} from "hyfn-server";

import { deleteImages } from "./common/utils/deleteImages";
import { sql } from "kysely";

interface UpdateProductProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
export const updateProductHandler = async ({
  arg,
  client,
  db,
  userId
}: UpdateProductProps) => {
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

      collections
    } = product;

    const { id, country, city } = arg[1];

    var returnValue = "initial";
    const mongo = client;

    const oldProductDoc = await trx
      .selectFrom("products")
      .selectAll()
      .where("id", "=", productId)
      .executeTakeFirstOrThrow();

    const collectionsIds =
      collections?.map((collection) => collection.value) || [];

    const updatedImages = oldProductDoc?.images?.filter(
      (image) => !deletedImages?.some((deletedImage) => deletedImage === image)
    );
    const whiteBackgroundImages = oldProductDoc?.whiteBackgroundImages?.filter(
      (oldWhiteImage) => !deletedImages?.includes(oldWhiteImage)
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

    const imagesURLs = images;

    await trx
      .updateTable("products")
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
        collectionsIds
      })
      .where("id", "=", productId)
      .execute();

    returnValue = "success";

    return { message: returnValue };
  });

  return response;
};

export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: updateProductHandler
  });
};
