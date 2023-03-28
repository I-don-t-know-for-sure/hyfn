export const removeFromCart = (data: any, product: any, setCartInfo: any) => {
  setCartInfo((prevState) => {
    const targetedStore = prevState[data._id.toString()];

    if (targetedStore) {
      const productToBeDeleted = prevState[targetedStore._id].addedProducts[product._id.toString()];
      console.log('🚀 ~ file: removeFromCart.ts:7 ~ setCartInfo ~ productToBeDeleted:', productToBeDeleted);

      if (Array.isArray(productToBeDeleted)) {
        if (productToBeDeleted.length > 1) {
          const newProductArray = productToBeDeleted.filter((oldProduct) => oldProduct.key === product.key);

          console.log('🚀 ~ file: removeFromCart.ts:11 ~ setCartInfo ~ newProductArray:', newProductArray);
          prevState[targetedStore._id].addedProducts[product._id.toString()] = newProductArray;
          return { ...prevState };
        }
      }

      delete targetedStore.addedProducts[product._id.toString()];
      if (Object.keys(targetedStore.addedProducts).length === 0) {
        delete prevState[targetedStore._id];
        return { ...prevState };
      }
      // const newState = { ...prevState, [targetedStore._id]: targetedStore };

      return { ...prevState, [targetedStore._id]: targetedStore };
    }
    return prevState;
  });
};
