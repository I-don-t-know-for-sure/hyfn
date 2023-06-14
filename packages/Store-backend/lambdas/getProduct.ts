export const getProductHandler = async ({
  arg,
  client,
  userId,
  db
}: MainFunctionProps) => {
  // await subscriptionCheck({ storedoc: userDocument, client, storeId: userDocument.id });

  const id = arg[0];
  const productId = arg[1];

  const product = await db
    .selectFrom("products")
    .selectAll()
    .where("id", "=", productId)
    .executeTakeFirstOrThrow();
  // const productCollection = await db
  //   .selectFrom('collectionsProducts')
  //   .selectAll()
  //   .where('productId', '=', productId)
  //   .execute();
  // const collections = productCollection.map((relation) => relation.collectionId);
  // if (collections.length === 0) {
  //   return { ...product, collections: [] };
  // }
  var collectionsArray = [];
  var qb = db
    .selectFrom("collections")
    .select(["id as value", "title as label"]);

  if (product.collectionsIds.length > 0) {
    collectionsArray = await qb
      .where(
        sql` id = any (array[${sql.join(
          product.collectionsIds || []
        )}]::uuid[])`
      )
      .execute();
  } else {
    collectionsArray = await qb.execute();
  }

  return { ...product, collections: collectionsArray };
};
interface GetProductProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import {
  MainFunctionProps,
  mainWrapper,
  tCollection,
  tCollections
} from "hyfn-server";
import { sql } from "kysely";
import { ObjectId } from "mongodb";

export const handler = async (event, ctx, callback) => {
  return await mainWrapper({ event, ctx, mainFunction: getProductHandler });
};
