export const updateUserDocumentHandler = async ({
  arg,

  db,
  userId,
}: UpdateUserDocumentProps) => {
  const customerInfo = arg[1];

  await db
    .updateTable('customers')
    .set({
      name: customerInfo.name,
    })
    .where('userId', '=', userId)
    .executeTakeFirst();
  return 'success';
};
interface UpdateUserDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { mainWrapper } from 'hyfn-server';
import { MainFunctionProps } from 'hyfn-server';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateUserDocumentHandler });
};
