export const disableLocalCardAPIKeysHandler = async ({
  arg,
  client,
  userId,
  db,
}: DisableLocalCardAPIKeysProps) => {
  const response = await db.transaction().execute(async (trx) => {
    const { flag = 'store' } = arg[0];

    const userDoc = await trx
      .selectFrom(flag === 'store' ? 'stores' : 'driverManagements')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirstOrThrow();
    if (flag === 'store') {
      if (userDoc.opened) {
        throw new Error(returnsObj['store is open']);
      }
    }

    await db
      .updateTable(flag === 'store' ? 'stores' : 'driverManagements')
      .set({
        localCardApiKeyId: null,
      })
      .where('userId', '=', userId)
      .execute();
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
