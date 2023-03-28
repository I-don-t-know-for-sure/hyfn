export const updateInstructions = ({
  instructions,
  productId,
  setCartInfo,
  storeId,
}: {
  setCartInfo: any;
  productId: string;
  storeId: string;
  instructions: string;
}) => {
  setCartInfo((prevState) => {
    console.log('🚀 ~ file: updateInstructions.ts:13 ~ setCartInfo ~ prevState', prevState);

    if (Array.isArray(prevState)) {
      const newState = prevState.map((store) => {
        if (store._id !== storeId) {
          return store;
        }
        return {
          ...store,
          addedProducts: { ...store.addedProducts, [productId]: { ...store.addedProducts[productId], instructions } },
        };
      });
      return [...newState];
    }

    const newState = {
      ...prevState,
      [storeId]: {
        ...prevState[storeId],
        addedProducts: {
          ...prevState[storeId].addedProducts,
          [productId]: { ...prevState[storeId].addedProducts[productId], instructions },
        },
      },
    };
    return newState;
  });
};
