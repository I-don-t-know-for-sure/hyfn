export const getAdminLocalCardCreds = () => {
  const MerchantId = process.env.MerchantId;
  const TerminalId = process.env.TerminalId;
  const secretKey = process.env.secretKey;
  return { MerchantId, TerminalId, secretKey };
};
