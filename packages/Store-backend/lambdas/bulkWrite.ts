("use strict");
interface BulkWriteProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
import { MainFunctionProps, mainWrapper, tProduct } from "hyfn-server";
import { measurementSystemObject, returnsObj } from "hyfn-types";
import { sql } from "kysely";
export const bulkWriteHandler = async ({
  event,
  arg,
  client,
  userId,
  db
}: BulkWriteProps) => {
  var result;
  // const storeDoc = await client
  //   .db('generalData')
  //   .collection('storeInfo')
  //   .findOne({ usersIds: userId }, {});
  const storeDoc = await db
    .selectFrom("stores")
    .select(["id"])
    .where("usersIds", "@>", sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();

  const storeId = storeDoc.id;

  const { productsArray } = arg[0];
  const objKeysExample = ["name", "price"];
  // const objKeysDetailed = [
  //   "title",
  //   "description",
  //   "price",
  //   "prevPrice",
  //   "costPerItem"
  // ];
  // input.data.pop();
  const results = productsArray.data;
  const objKeys = results[0];

  objKeys.forEach((key) => {
    const found = objKeysExample.find((example) => {
      return example === key;
    });
    if (!found) throw new Error("keys don`t match");
  });
  var outputArray = [];
  for (let i = 1; i < results?.length; i++) {
    const row = results[i];
    var outputObject;
    for (let x = 0; x < row.length; x++) {
      if (objKeys[x] === "name") {
        outputObject = {
          ...outputObject,
          title: row[x],
          description: row[x]
        };
        continue;
      }

      if (objKeys[x] === "price") {
        outputObject = {
          ...outputObject,

          price: `${row[x]}`,

          prevPrice: `${row[x]}`
        };
        continue;
      }
      // if (objKeys[x] === "barcode") {
      //   const libraryProductDoc = await client
      //     .db("productsLibrary")
      //     .collection("products")
      //     .findOne(
      //       { barcode: row[x].trim() },
      //       { projection: { id: 0, images: 1 } }
      //     );
      //   outputObject = {
      //     ...outputObject,
      //     images: libraryProductDoc?.images
      //   };
      // }
    }
    // schema validation with yup
    const validated = {
      ...outputObject,
      storeId,
      hasOptions: false,

      options: [],

      isActive: false,
      whiteBackgroundImages: [],
      collectionsIds: [],
      images: [],

      measurementSystem: measurementSystemObject.unit
    } as tProduct;
    outputArray.push(validated);
  }
  if (outputArray?.length === 0) {
    throw new Error(returnsObj["file empty"]);
  }
  // await client.db("base").collection("products").insertMany(outputArray);
  await db.insertInto("products").values(outputArray).execute();
  return result;
};
export const handler = async (event, ctx, callback) => {
  return await mainWrapper({
    ctx,
    callback,
    event,
    mainFunction: bulkWriteHandler
  });
};
