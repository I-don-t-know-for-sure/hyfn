export const getPagesLength = (data: any) => {
  const length = data?.pages?.reduce((accu: any, crr: any) => {
    return accu + crr?.length;
  }, 0);
  return length;
};
