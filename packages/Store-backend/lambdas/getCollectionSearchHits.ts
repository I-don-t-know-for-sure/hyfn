import { MainFunctionProps, mainWrapper, tCollections } from "hyfn-server";
import { productTabsObject } from "hyfn-types";
import { sql } from "kysely";

interface GetCollectionSearchHitsProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}

export const getCollectionSearchHits = async ({
  arg,

  db
}: GetCollectionSearchHitsProps) => {
  const { searchValue, filter, lastDoc } = arg[0];
  var qb = db
    .selectFrom("collections")
    .select(["id", "title", "isActive"])
    .where(sql`${sql.raw(tCollections.title)} <-> ${searchValue} < 0.8`);

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

  return await qb.offset(lastDoc || 0).execute();
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getCollectionSearchHits });
};
