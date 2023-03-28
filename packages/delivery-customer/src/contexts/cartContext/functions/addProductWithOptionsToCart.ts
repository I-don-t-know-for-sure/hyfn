export const addProductWithOptionsToCart = (
  data: any,
  product: any,
  setCartInfo: any,
  city: string,
  country: string,
  orderType?: string,
) => {
  setCartInfo((prevState) => {
    const proto = {
      storeName: data?.storeName,

      image: data?.image,
      _id: data._id.toString(),
      city,
      country,
      storeType: data.storeType,
      currency: data.currency,
      coords: data.coords,
      orderType: orderType || 'Delivery',
      addedProducts: {
        [product._id.toString()]: [
          {
            ...product,
          },
        ],
      },
    };

    if (!(Object.keys(prevState)?.length > 0)) {
      return { [data._id.toString()]: proto };
    }

    const targetedStore = prevState[data._id.toString()];

    if (!targetedStore) {
      return { ...prevState, [data._id.toString()]: proto };
    }

    if (targetedStore) {
      const newProduct = Array.isArray(targetedStore.addedProducts[product._id.toString()])
        ? [...targetedStore.addedProducts[product._id.toString()], product]
        : [product];
      const newState = {
        ...prevState,
        [targetedStore._id]: {
          ...prevState[targetedStore._id],
          addedProducts: {
            ...targetedStore.addedProducts,
            [product._id.toString()]: newProduct,
          },
        },
      };

      return newState;
    }
  });
};
