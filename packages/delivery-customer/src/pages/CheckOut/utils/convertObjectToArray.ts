export const convertObjectToArray = (cart: any) => {
  const test = Object.keys(cart).map((storeKey) => {
    const store = cart[storeKey];
    const addedProducts = Object.keys(store.addedProducts).flatMap((productKey) => {
      return store.addedProducts[productKey];
    });
    return {
      ...store,
      addedProducts,
    };
  });
  console.log(test);

  return test;
};
