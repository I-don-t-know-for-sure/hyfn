export function calculateOrderCost(storesArray) {
  return storesArray.reduce((accu, store, currentIndex) => {
    const storeTotal = store.addedProducts?.reduce(
      (acc, product) => acc + product.price * product.qty,
      0
    );

    // storesArray.map((oldStore) => {
    //   if (oldStore._id === store._id) {
    //     return { ...oldStore, orderCost: storeTotal - storeTotal * storeServiceFee };
    //   }
    //   return oldStore;
    // });
    return accu + storeTotal;
  }, 0);
}
