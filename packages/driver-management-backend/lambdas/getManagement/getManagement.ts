export const getManagementHandler = async ({ arg, client, userId }: MainFunctionProps) => {
    const result = await client
        .db('generalData')
        .collection('driverManagement')
        .findOne({ userId }, {});
    return result;
};
interface GetManagementProps extends Omit<MainFunctionProps, 'arg'> {
    arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event) => {
    return await mainWrapper({ event, mainFunction: getManagementHandler });
};
