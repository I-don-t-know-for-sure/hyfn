export const updateUserDocumentHandler = async ({
  arg,
  session,
  client,
  event,
  db,
  userId,
}: MainFunctionProps) => {
  var result;
  const customerInfo = arg[1];

  await db
    .updateTable('customers')
    .set({
      name: customerInfo.name,
    })
    .where('userId', '=', userId)
    .executeTakeFirst();
  result = 'success';
  return result;
};
interface UpdateUserDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateUserDocumentHandler });
};
