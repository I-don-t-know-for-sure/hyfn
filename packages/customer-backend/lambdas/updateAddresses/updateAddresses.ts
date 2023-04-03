export const updateAddressesHandler = async ({ arg, client }: MainFunctionProps) => {
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
    await client
        .db('generalData')
        .collection('customerInfo')
        .updateOne({ _id: new ObjectId(customerId) }, {
        $set: {
            addresses: validatedAddresses,
        },
    }, {});
    result = 'success';
    return result;
};
interface UpdateAddressesProps extends Omit<MainFunctionProps, 'arg'> {
    arg: any;
}
('use strict');
import { ObjectId } from 'mongodb';
import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';
export const handler = async (event) => {
    return await mainWrapper({ event, mainFunction: updateAddressesHandler });
};
