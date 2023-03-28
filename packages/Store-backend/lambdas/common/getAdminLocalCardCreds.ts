export const getAdminLocalCardCreds = () => {
  const MerchantId = process.env.MerchantId;
  const TerminalId = process.env.TerminalId;
  const secretKey = process.env.secretKey;
  console.log(
    '🚀 ~ file: getAdminLocalCardCreds.js:5 ~ getAdminLocalCardCreds ~ secretKey',
    secretKey
  );

  return { MerchantId, TerminalId, secretKey };
};
