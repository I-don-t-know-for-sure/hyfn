export const getAllCollectionsHandler = async ({
  arg,
  client,
  db,
  userId
}: MainFunctionProps) => {
  const { storeId, filter, lastDoc } = arg[0];

  var qb = db
    .selectFrom("collections")
    .selectAll()
    .where("storeId", "=", storeId)
    .limit(10);
  if (
    filter === productTabsObject.active ||
    filter === productTabsObject.inactive
  ) {
    qb = qb.where(
      "isActive",
      "=",
      filter === productTabsObject.active ? true : false
    );
  }
  const collections = await qb.offset(lastDoc || 0).execute();
  return collections;
};
interface GetAllCollectionsProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { productTabsObject } from "hyfn-types";
import { sql } from "kysely";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: getAllCollectionsHandler
  });
};
