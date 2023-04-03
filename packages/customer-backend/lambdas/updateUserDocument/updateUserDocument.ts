export const updateUserDocumentHandler = async ({ arg, session, client, event, }: MainFunctionProps) => {
    var result;
    const customerInfo = arg[1];
    const { userId: customerId } = arg[arg?.length - 1];
    await client
        .db('generalData')
        .collection('customerInfo')
        .updateOne({
        customerId,
    }, {
        $set: {
            name: customerInfo.name,
            // country: customerInfo.country,
        },
    }, {});
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
