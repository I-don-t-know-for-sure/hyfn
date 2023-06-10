import { MainFunctionProps, mainWrapper, tProducts } from "hyfn-server";
import { sql } from "kysely";
import { title } from "process";

interface SearchProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}

export const getSearchHits = async ({ arg, userId, db }: SearchProps) => {
  const { searchValue } = arg[0];

  const hits = await db
    .selectFrom("products")
    .where(({ or }) =>
      or([
        sql`${sql.raw(tProducts.title)} <-> ${searchValue} < 0.8`,
        sql`${sql.raw(tProducts.description)} <-> ${searchValue} < 0.8`
      ])
    )
    .select(["id", "images", "title", "storeId", "hasOptions"])
    .limit(10)
    .execute();
  return hits;
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getSearchHits });
};
