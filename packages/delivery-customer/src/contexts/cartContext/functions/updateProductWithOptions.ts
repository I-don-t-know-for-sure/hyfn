export const updateProductWithOptions = (
  data: any,
  product: any,
  setCartInfo: any
) => {
  setCartInfo((prevState) => {
    const targetedStore = prevState[data.id];
    const newProducts = targetedStore.addedProducts[product.id].map(
      (oldProduct) => {
        if (oldProduct.key === product.key) {
          return { ...oldProduct, options: product.options, qty: product.qty };
        }
        return oldProduct;
      }
    );

    if (targetedStore) {
      const newState = {
        ...prevState,
        [targetedStore.id]: {
          ...targetedStore,
          addedProducts: {
            ...targetedStore.addedProducts,
            [product.id]: newProducts,
          },
        },
      };

      return newState;
    }
  });
};
