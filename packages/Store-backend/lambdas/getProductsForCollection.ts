export const getProductsForCollectionHandler = async ({
  arg,
  client,
  db
}: MainFunctionProps) => {
  var result;
  const { country, storeId, collectionId, lastDocNumber } = arg[0];
  // if (lastDoc) {
  //   result = await client
  //     .db('base')
  //     .collection('products')
  //     .find(
  //       {
  //         'id': { $gt: new ObjectId(lastDoc) },
  //         storeId,
  //         'collections.value': { $ne: collectionId },
  //       },
  //       {
  //         projection: {
  //          id: 1,
  //           textInfo: 1,
  //         },
  //       }
  //     )
  //     .limit(20)
  //     .toArray();
  //   result = result.map((product) => {
  //     return { value: product.id, label: product.textInfo.title };
  //   });
  //   return;
  // }
  // result = await client
  //   .db('base')
  //   .collection('products')
  //   .find(
  //     { storeId, 'collections.value': { $ne: collectionId } },
  //     {
  //       projection: {
  //        id: 1,
  //         textInfo: 1,
  //       },
  //     }
  //   )
  //   .limit(20)
  //   .toArray();
  const products = await db
    .selectFrom("products")
    .select(["id as value", "title as label"])
    .where("storeId", "=", storeId)
    .where(({ not, cmpr }) =>
      not(
        cmpr(
          "collectionsIds",
          "@>",
          sql`array[${sql.join([collectionId])}]::uuid[]`
        )
      )
    )
    .offset(lastDocNumber || 0)
    .limit(10)
    .execute();

  return products;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
};
interface GetProductsForCollectionProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { sql } from "kysely";

export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: getProductsForCollectionHandler
  });
};
