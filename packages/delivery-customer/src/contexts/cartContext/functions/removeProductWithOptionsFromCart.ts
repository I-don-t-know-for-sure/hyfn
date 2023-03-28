export const removeProductWithOptionsFromCart = (data: any, product: any, setCartInfo: any) => {
  setCartInfo((prevState) => {
    const targetedStore = prevState[data._id.toString()];

    if (targetedStore) {
      const products = targetedStore.addedProducts[product._id];
      const newProducts = products.filter((oldProduct) => oldProduct?.key !== product.key);

      if (newProducts?.length > 0) {
        targetedStore.addedProducts[product._id] = newProducts;
      } else {
        delete targetedStore.addedProducts[product._id];
      }
      if (Object.keys(targetedStore.addedProducts).length === 0) {
        delete prevState[targetedStore._id];
        return { ...prevState };
      }
      const newState = { ...prevState, [targetedStore._id]: targetedStore };

      return { ...newState };
    }
  });
};
