export const removeFromCart = (data: any, product: any, setCartInfo: any) => {
  setCartInfo((prevState) => {
    const targetedStore = prevState[data.id.toString()];

    if (targetedStore) {
      const productToBeDeleted =
        prevState[targetedStore.id].addedProducts[product.id];
      console.log(
        "🚀 ~ file: removeFromCart.ts:7 ~ setCartInfo ~ productToBeDeleted:",
        productToBeDeleted
      );

      if (Array.isArray(productToBeDeleted)) {
        if (productToBeDeleted.length > 1) {
          const newProductArray = productToBeDeleted.filter(
            (oldProduct) => oldProduct.key === product.key
          );

          console.log(
            "🚀 ~ file: removeFromCart.ts:11 ~ setCartInfo ~ newProductArray:",
            newProductArray
          );
          prevState[targetedStore.id].addedProducts[product.id] =
            newProductArray;
          return { ...prevState };
        }
      }

      delete targetedStore.addedProducts[product.id];
      if (Object.keys(targetedStore.addedProducts).length === 0) {
        delete prevState[targetedStore.id];
        return { ...prevState };
      }
      // const newState = { ...prevState, [targetedStore.id]: targetedStore };

      return { ...prevState, [targetedStore.id]: targetedStore };
    }
    return prevState;
  });
};
