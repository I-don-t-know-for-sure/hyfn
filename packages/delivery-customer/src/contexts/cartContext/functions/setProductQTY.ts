export const updateProductWithOptions = (data: any, product: any, setCartInfo: any) => {
  setCartInfo((prevState) => {
    const targetedStore = prevState[data._id.toString()];

    if (targetedStore) {
      const newState = {
        ...prevState,
        [targetedStore._id]: {
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
