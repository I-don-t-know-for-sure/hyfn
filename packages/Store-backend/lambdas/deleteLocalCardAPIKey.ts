interface DeleteLocalCardAPIKeyProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

export const deleteLocalCardAPIKey = async ({ db, userId }: MainFunctionProps) => {
  const response = await db.transaction().execute(async (trx) => {
    const storeDoc = await trx
      .selectFrom('stores')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirstOrThrow();
    await trx
      .updateTable('stores')
      .set({
        localCardApiKeyId: null,
      })
      .where('userId', '=', userId)
      .executeTakeFirst();

    await trx
      .updateTable('localCardKeys')
      .set({
        inUse: false,
      })
      .where('id', '=', storeDoc.localCardApiKeyId)
      .execute();

    return 'success';
  });

  return response;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: deleteLocalCardAPIKey });
};
