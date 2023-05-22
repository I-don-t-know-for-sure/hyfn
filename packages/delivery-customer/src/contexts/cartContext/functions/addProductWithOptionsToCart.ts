export const addProductWithOptionsToCart = (
  data: any,
  product: any,
  setCartInfo: any,
  city: string,
  country: string,
  orderType?: string
) => {
  setCartInfo((prevState) => {
    const proto = {
      storeName: data?.storeName,

      image: data?.image,
      id: data.id,
      city,
      country,
      storeType: data.storeType,
      currency: data.currency,
      coords: data.coords,
      orderType: orderType || "Delivery",
      addedProducts: {
        [product.id]: [
          {
            ...product,
          },
        ],
      },
    };

    if (!(Object.keys(prevState)?.length > 0)) {
      return { [data.id]: proto };
    }

    const targetedStore = prevState[data.id];

    if (!targetedStore) {
      return { ...prevState, [data.id]: proto };
    }

    if (targetedStore) {
      const newProduct = Array.isArray(targetedStore.addedProducts[product.id])
        ? [...targetedStore.addedProducts[product.id], product]
        : [product];
      const newState = {
        ...prevState,
        [targetedStore.id]: {
          ...prevState[targetedStore.id],
          addedProducts: {
            ...targetedStore.addedProducts,
            [product.id]: newProduct,
          },
        },
      };

      return newState;
    }
  });
};
