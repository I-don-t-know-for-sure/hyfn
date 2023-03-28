const { ObjectId } = require('mongodb');
const { adminName } = require('../common/constants');
const { getAdminLocalCardCreds } = require('../common/getAdminLocalCardCreds');
const { isLocalCardTransactionValidated } = require('../common/isLocalCardTransactionValidated');
const { mainWrapper } = require('../common/mainWrapper');
const { findOne } = require('../common/mongoUtils/findOne');
const { updateOne } = require('../common/mongoUtils/updateOne');
const { mainWrapperWithSession } = require('../common/mainWrapperWithSession');

const validateLocalCardTransaction = async ({ arg, client, session }) => {
  const { transactionId } = arg[0];
  console.log(
    '🚀 ~ file: validateLocalCardTransaction.js ~ line 12 ~ validateLocalCardTransaction ~ transactionId',
    transactionId
  );
  // const dataServicesURL = process.env.moalmlatDataService;

  const transaction = await findOne(
    { _id: new ObjectId(transactionId) },
    // { session },
    {},
    client.db('generalData').collection('transactions')
  );
  console.log('any');
  if (transaction.validated) {
    return 'transaction already approved';
  }
  console.log('log here');
  if (transaction.storeId === adminName) {
    var { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();
  }
  console.log('shsh');
  const isValidated = await isLocalCardTransactionValidated({
    MerchantId,
    secretKey,
    TerminalId,
    transactionId,
    client,
    session,
    amount: transaction.amount,
  });
  console.log('herehh');
  if (isValidated) {
    await updateOne({
      query: {
        _id: new ObjectId(transaction.customerId),
      },
      update: {
        $inc: { balance: Math.abs(parseFloat(transaction.amount.toFixed(3))) },
      },
      options: { session },
      collection: client.db('generalData').collection('driverData'),
    });
    return 'transaction approved';
  }

  return 'transaction not approved yet or not found';
};

export const handler = async (event) => {
  return await mainWrapperWithSession({ event, mainFunction: validateLocalCardTransaction });
};
