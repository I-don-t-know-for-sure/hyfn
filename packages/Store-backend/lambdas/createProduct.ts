("use strict");
interface CreateProductProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { sql } from "kysely";

export const createProductHandler = async ({
  arg,
  client,
  userId,
  db
}: CreateProductProps) => {
  const product = arg[0];
  const {
    title,
    description,
    price,
    prevPrice,
    currency,

    measurementSystem,
    hasOptions,
    options,
    isActive,
    imagesURLs,
    collections
  } = product;

  const productId = await db.transaction().execute(async (trx) => {
    const images = imagesURLs;

    const storeDoc = await trx
      .selectFrom("stores")
      .selectAll()
      .where("usersIds", "@>", sql`array[${sql.join([userId])}]::uuid[]`)
      .executeTakeFirstOrThrow();
    if (!storeDoc) throw new Error("store not found");
    const id = storeDoc.id;
    const city = storeDoc.city;

    const collectionsIds =
      collections?.map((collection) => collection.value) || [];
    const product = await trx
      .insertInto("products")
      .values({
        title: title,
        description: description,
        storeId: id,
        collectionsIds,
        options: options || [],
        isActive,
        hasOptions: hasOptions,
        images: images,
        price: price,
        prevPrice: prevPrice,

        measurementSystem: measurementSystem,
        whiteBackgroundImages: []
      })
      .returning("id")
      .executeTakeFirst();
    // if (collections?.length > 0) {
    //   await trx
    //     .insertInto("collectionsProducts")
    //     .values([
    //       ...collections?.map((collection) => {
    //         return { collectionId: collection.value, productId: product.id };
    //       })
    //     ])
    //     .execute();
    // }
    return product.id;
  });

  return productId;
};
export const handler = async (event, ctx, callback) => {
  return await mainWrapper({
    mainFunction: createProductHandler,
    ctx,
    callback,
    event
  });
};
