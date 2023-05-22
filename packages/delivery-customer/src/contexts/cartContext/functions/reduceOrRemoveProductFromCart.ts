export const reduceOrRemoveProductFromCart = (
  data: any,
  product: any,
  setCartInfo: any
) => {
  console.log("shshsshshshshshshsshshsh");
  setCartInfo((prevState) => {
    const targetedStore = prevState[data.id];

    if (targetedStore) {
      const oldProduct = targetedStore.addedProducts[product.id];

      if (oldProduct && oldProduct.qty > 1) {
        const newProduct = {
          ...oldProduct,
          qty: oldProduct.qty - 1,
        };

        const newState = {
          ...prevState,
          [targetedStore.id]: {
            ...targetedStore,
            addedProducts: {
              ...targetedStore.addedProducts,
              [newProduct.id]: newProduct,
            },
          },
        };

        return newState;
      }

      if (oldProduct?.qty === 1) {
        delete targetedStore.addedProducts[product.id];
        // const newProducts = targetedStore.addedProducts.filter(
        //   (oldProduct) => oldProduct.id !== product.id.toString()
        // );

        if (Object.keys(targetedStore.addedProducts).length === 0) {
          delete prevState[targetedStore.id];
          const newState = prevState;
          return { ...newState };
        }

        const newState = { ...prevState, [targetedStore.id]: targetedStore };

        return newState;
      }
      return { ...prevState };
    }
    return { ...prevState };
  });
};
