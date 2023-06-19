interface GetStoreFrontProps extends Omit<MainFunctionProps, "arg"> {}
("use strict");
import { ObjectId } from "mongodb";
import { MainFunctionProps, tCollection, tCollections } from "hyfn-server";
import { mainWrapper } from "hyfn-server";
import { sql } from "kysely";
interface GetStoreFrontProps extends Omit<MainFunctionProps, "arg"> {
  arg: any[];
}
export const getStoreFront = async ({
  arg,
  client,
  db
}: GetStoreFrontProps) => {
  const storeFrontId = arg[1];

  const storeFrontDoc = await db
    .selectFrom("stores")
    .innerJoin("collections", (join) =>
      join
        .onRef("collections.storeId", "=", "stores.id")
        .on("collections.isActive", "=", true)
    )
    .select(
      sql
        .raw<tCollection[]>(`jsonb_agg(${tCollections._}.*)`)
        .as(tCollections._)
    )
    .select([
      "stores.id",
      "acceptingOrders",
      "address",
      "city",
      "country",
      "lat",
      "long",
      "image",
      "opened",
      "storeName",
      "storePhone",
      "stores.description",
      "storeType",
      "stores.acceptDeliveryOrders",
      "stores.acceptPickupOrders"
    ])
    .groupBy("stores.id")
    .where("stores.id", "=", storeFrontId)
    .executeTakeFirstOrThrow();

  return storeFrontDoc;
  // Ensures that the client will close when you finish/error
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getStoreFront });
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
