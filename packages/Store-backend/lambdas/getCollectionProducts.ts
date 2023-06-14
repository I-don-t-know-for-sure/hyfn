export const getCollectionProductsHandler = async ({
  arg,
  client,
  db
}: MainFunctionProps) => {
  var result;

  const { lastDoc, collectionId } = arg[0];

  const products = await db
    .selectFrom("products")
    .where(
      "collectionsIds",
      "@>",
      sql`array[${sql.join([collectionId])}]::uuid[]`
    )
    // .innerJoin('products', 'collectionsProducts.productId', 'products.id')
    // .innerJoinLateral(
    //   (eb) =>
    //     eb
    //       .selectFrom('products')
    //       .selectAll()
    //       .whereRef('products.id', '=', 'collectionsProducts.productId')
    //       // .limit(5)
    //       .as('products'),
    //   (join) => join.onTrue()
    // )
    .select(["products.id", "products.title"])
    .offset(lastDoc > 0 ? lastDoc : 0)
    .limit(5)
    .execute();

  result = products.map((product) => {
    return {
      value: product.id,
      label: product?.title
    };
  });
  return result;
};
interface GetCollectionProductsProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { sql } from "kysely";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: getCollectionProductsHandler
  });
};
