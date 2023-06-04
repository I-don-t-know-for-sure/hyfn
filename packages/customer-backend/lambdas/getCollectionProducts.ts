interface GetCollectionProductsProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { ObjectId } from 'mongodb';
import { buildJson, getJson, mainWrapper, tProduct, tProducts } from 'hyfn-server';
import { MainFunctionProps } from 'hyfn-server';
import { sql } from 'kysely';
interface GetCollectionProductsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const getCollectionProducts = async ({ arg, client, db }: GetCollectionProductsProps) => {
  const { country, storefront, collectionid, documents = 25, lastDocNumber } = arg[0];

  /* const collectionProductRelations = await db
    .selectFrom('collectionsProducts')
    .where('collectionId', '=', collectionid)
    .innerJoinLateral(
      (eb) =>
        eb
          .selectFrom('products')
          .selectAll()
          .whereRef('products.id', '=', 'collectionsProducts.productId')
          .limit(5)
          .as('products'),
      (join) => join.onTrue()
    )

    .select(
      // ['products.id', 'products.isActive']
      buildJson<tProduct>(tProducts, [
        'id',
        'images',
        'description',
        'prevPrice',
        'price',
        'title',

        'hasOptions',
      ]).as(tProducts._)
    )
    .offset(lastDocNumber > 0 ? lastDocNumber : 0)
    .limit(5)
    .execute(); */
  const collectionsProducts = await db
    .selectFrom('collectionsProducts')
    .select(['collectionsProducts.productId'])
    .where('collectionId', '=', collectionid)
    .limit(5)
    .offset(lastDocNumber > 0 ? lastDocNumber : 0)
    .execute();
  const productsIds = collectionsProducts.map((product) => product.productId);
  if (productsIds.length === 0) return [];

  const products = await db
    .selectFrom('products')
    .where('id', 'in', productsIds)
    .select(['id', 'images', 'description', 'prevPrice', 'price', 'title', 'hasOptions'])
    .execute();

  // const products = collectionProductRelations.flatMap((collection) => {
  //   return collection.products;
  // });

  return products;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getCollectionProducts });
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
