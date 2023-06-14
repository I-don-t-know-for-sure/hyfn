interface SearchProductsProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
export const getSearchHits = async ({
  arg,
  client,
  db
}: SearchProductsProps) => {
  const { searchValue, filter, lasDoc } = arg[0];

  var qb = db
    .selectFrom("products")
    .select(["id", "title"])
    .where(sql`${sql.raw(tProducts.title)} <-> ${searchValue} < 0.8`);

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
  if (lasDoc) {
    qb = qb.offset(lasDoc);
  }
  const result = qb.execute();
  return result;
};

import { MainFunctionProps, mainWrapper, tProducts } from "hyfn-server";
import { productTabsObject } from "hyfn-types";
import { sql } from "kysely";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getSearchHits });
};
