export const updateProductWithOptions = (
  data: any,
  product: any,
  setCartInfo: any
) => {
  setCartInfo((prevState) => {
    const targetedStore = prevState[data.id];

    if (targetedStore) {
      const newState = {
        ...prevState,
        [targetedStore.id]: {
          ...targetedStore,
          addedProducts: {
            ...targetedStore.addedProducts,
            [product.key]: product,
          },
        },
      };

      return newState;
    }
  });
};
