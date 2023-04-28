export const withTransaction = async ({
  fn,
  session,
}: {
  session: any;
  fn: any;
}) => {
  var result;
  try {
    await session.withTransaction(async () => {
      result = await fn();
    });
  } catch (e) {
    await session.endSession();
    throw new Error(e as any);
  }

  return result;
};
