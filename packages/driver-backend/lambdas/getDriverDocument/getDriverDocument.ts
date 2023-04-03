export const getDriverDocumentHandler = async ({ arg, client }: MainFunctionProps) => {
    var result;
    const { userId } = arg[0];
    console.log(userId);
    result = await client.db('generalData').collection('driverData').findOne({
        driverId: userId,
    });
    console.log(result);
    return result;
    // Ensures that the client will close when you finish/error
};
interface GetDriverDocumentProps extends Omit<MainFunctionProps, 'arg'> {
    arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
    return await mainWrapper({ event, mainFunction: getDriverDocumentHandler });
};
