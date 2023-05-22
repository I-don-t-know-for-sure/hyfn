export const updateAddressesHandler = async ({ arg, client, userId, db }: MainFunctionProps) => {
  var result;
  //   const arg = event;
  const { addresses, customerId } = arg[0];
  // const schema = array().of(
  //   object({
  //     label: string().required(),
  //     coords: array().length(2).of(number()).required(),
  //     locationDescription: string(),
  //     key: string(),
  //   })
  //     .strict()
  //     .noUnknown()
  // );
  const validatedAddresses = addresses;
  const customerDoc = await db
    .selectFrom('customers')
    .select('addresses')
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  await db
    .updateTable('customers')
    .set({
      addresses: [...validatedAddresses],
    })
    .where('userId', '=', userId)
    .executeTakeFirst();
  result = 'success';
  return result;
};
interface UpdateAddressesProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { ObjectId } from 'mongodb';
import { mainWrapper } from 'hyfn-server';
import { MainFunctionProps } from 'hyfn-server';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateAddressesHandler });
};
