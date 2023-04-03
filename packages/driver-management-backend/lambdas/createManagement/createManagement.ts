export const createManagementHandler = async ({ arg, client, userId }: MainFunctionProps) => {
    const { balance, ...managerInfo } = arg[0];
    const result = await client
        .db('generalData')
        .collection('driverManagement')
        .insertOne({
        ...managerInfo,
        userId,
        // managementCut: DEFAULT_MANAGEMENT_CUT,
        balance: 0,
        usedBalance: 0,
    }, {});
    return 'sucess';
};
interface CreateManagementProps extends Omit<MainFunctionProps, 'arg'> {
    arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { DEFAULT_MANAGEMENT_CUT } from 'hyfn-types';
export const handler = async (event) => {
    return await mainWrapper({ event, mainFunction: createManagementHandler });
};
