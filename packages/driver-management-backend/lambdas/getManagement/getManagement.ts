import { MainFunctionProps, mainWrapper } from 'hyfn-server';
interface GetManagementProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const getManagementHandler = async ({ arg, client, userId }: GetManagementProps) => {
  const result = await client
    .db('generalData')
    .collection('driverManagement')
    .findOne({ usersIds: userId }, {});
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getManagementHandler });
};
