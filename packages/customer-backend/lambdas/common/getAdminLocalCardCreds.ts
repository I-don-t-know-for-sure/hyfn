interface GetAdminLocalCardCredsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
export const getAdminLocalCardCreds = () => {
  const MerchantId = process.env.MerchantId;
  const TerminalId = process.env.TerminalId;
  const secretKey = process.env.secretKey;

  return { MerchantId, TerminalId, secretKey };
};
