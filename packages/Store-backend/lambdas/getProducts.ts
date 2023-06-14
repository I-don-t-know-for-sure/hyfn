export const getProducts = async ({
  arg,
  client,
  userId,
  db
}: MainFunctionProps) => {
  const { storeId, lastDoc, filter } = arg[0];

  const ALL_PPRODUCTS = "all";
  const filters = { active: true, inActive: false };
  const isFiltered = filter !== ALL_PPRODUCTS;

  var qb = db
    .selectFrom("products")
    .select(["id", "title", "isActive"])
    .where("storeId", "=", storeId);

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
  const products = await qb
    .offset(lastDoc || 0)
    .limit(10)
    .execute();

  return products;
};
interface GetProductsForBulkUpdateProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { productTabsObject } from "hyfn-types";

export const handler = async (event, ctx) => {
  return await mainWrapper({ event, mainFunction: getProducts });
};
