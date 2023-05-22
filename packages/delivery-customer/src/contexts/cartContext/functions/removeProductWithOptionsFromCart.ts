export const removeProductWithOptionsFromCart = (
  data: any,
  product: any,
  setCartInfo: any
) => {
  setCartInfo((prevState) => {
    const targetedStore = prevState[data.id];

    if (targetedStore) {
      const products = targetedStore.addedProducts[product.id];
      const newProducts = products.filter(
        (oldProduct) => oldProduct?.key !== product.key
      );

      if (newProducts?.length > 0) {
        targetedStore.addedProducts[product.id] = newProducts;
      } else {
        delete targetedStore.addedProducts[product.id];
      }
      if (Object.keys(targetedStore.addedProducts).length === 0) {
        delete prevState[targetedStore.id];
        return { ...prevState };
      }
      const newState = { ...prevState, [targetedStore.id]: targetedStore };

      return { ...newState };
    }
  });
};
