export const disableLocalCardAPIKeysHandler = async ({
  arg,
  client,
  userId,
  db,
}: MainFunctionProps) => {
  const response = await db.transaction().execute(async (trx) => {
    const storeDoc = await trx
      .selectFrom('stores')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirstOrThrow();
    if (storeDoc.opened) {
      throw new Error(returnsObj['store is open']);
    }

    await trx.deleteFrom('localCardKeys').where('id', '=', storeDoc.localCardApiKeyId).execute();
  });

  return response;
};
interface DisableLocalCardAPIKeysProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { returnsObj } from 'hyfn-types';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: disableLocalCardAPIKeysHandler });
};
