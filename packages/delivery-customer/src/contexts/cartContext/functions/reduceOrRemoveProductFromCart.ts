export const reduceOrRemoveProductFromCart = (data: any, product: any, setCartInfo: any) => {
  console.log('shshsshshshshshshsshshsh');
  setCartInfo((prevState) => {
    const targetedStore = prevState[data._id.toString()];

    if (targetedStore) {
      const oldProduct = targetedStore.addedProducts[product._id.toString()];

      if (oldProduct && oldProduct.qty > 1) {
        const newProduct = {
          ...oldProduct,
          qty: oldProduct.qty - 1,
        };

        const newState = {
          ...prevState,
          [targetedStore._id]: {
            ...targetedStore,
            addedProducts: {
              ...targetedStore.addedProducts,
              [newProduct._id]: newProduct,
            },
          },
        };

        return newState;
      }

      if (oldProduct?.qty === 1) {
        delete targetedStore.addedProducts[product._id.toString()];
        // const newProducts = targetedStore.addedProducts.filter(
        //   (oldProduct) => oldProduct._id !== product._id.toString()
        // );

        if (Object.keys(targetedStore.addedProducts).length === 0) {
          delete prevState[targetedStore._id];
          const newState = prevState;
          return { ...newState };
        }

        const newState = { ...prevState, [targetedStore._id]: targetedStore };

        return newState;
      }
      return { ...prevState };
    }
    return { ...prevState };
  });
};
