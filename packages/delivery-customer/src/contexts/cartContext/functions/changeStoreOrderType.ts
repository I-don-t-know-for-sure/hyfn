export const changeStoreOrderType = ({
  setCartInfo,
  orderType,
  storeId,
}: {
  setCartInfo: any;
  orderType: string;
  storeId: string;
}) => {
  setCartInfo((prevInfo) => {
    const storeType = prevInfo[storeId].storeType;

    const newState = {
      ...prevInfo,
      [storeId]: {
        ...prevInfo[storeId],
        orderType,
      },
    };

    return { ...newState };
  });
};
