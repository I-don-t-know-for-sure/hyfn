export const withTransaction = async ({
  fn,
  session,
  options,
}: {
  session: any;
  fn: any;
  options?: any;
}) => {
  var result;
  try {
    await session.withTransaction(async () => {
      result = await fn();
    }, options);
  } catch (e) {
    await session.endSession();
    throw new Error(e as any);
  }

  return result;
};
