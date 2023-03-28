export const updateProductWithOptions = (data: any, product: any, setCartInfo: any) => {
  setCartInfo((prevState) => {
    const targetedStore = prevState[data._id.toString()];
    const newProducts = targetedStore.addedProducts[product._id].map((oldProduct) => {
      if (oldProduct.key === product.key) {
        return { ...oldProduct, options: product.options, qty: product.qty };
      }
      return oldProduct;
    });

    if (targetedStore) {
      const newState = {
        ...prevState,
        [targetedStore._id]: {
          ...targetedStore,
          addedProducts: {
            ...targetedStore.addedProducts,
            [product._id]: newProducts,
          },
        },
      };

      return newState;
    }
  });
};
