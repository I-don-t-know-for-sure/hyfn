import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { sql } from "kysely";

interface GetDriverManagementsProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}

export const getDriverManagements = async ({
  arg,
  userId,
  db
}: GetDriverManagementsProps) => {
  const { country, fromCity, toCity, storeId } = arg[0];
  const storeDoc = await db
    .selectFrom("stores")
    .select(["id", "deliverWithStoreDrivers"])
    .where("id", "=", storeId)
    .executeTakeFirstOrThrow();

  if (storeDoc.deliverWithStoreDrivers) {
    return storeDoc;
  }

  const driverManagements = await db
    .selectFrom("driverManagements")
    .select([
      "managementName",
      "managementPhone",
      "driverManagements.id",
      "haveAPI"
    ])
    .where("country", "=", country)
    .where("deliverTo", "=", sql`${sql.join([toCity])}`)
    .where("deliverFrom", "=", sql`${sql.join([fromCity])}`)
    .execute();
  return driverManagements;
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getDriverManagements });
};
