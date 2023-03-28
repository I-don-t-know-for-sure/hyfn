export const addProductToCart = (
  data: any,
  product: any,
  setCartInfo: any,
  city?: string,
  country?: string,
  orderType?: string,
) => {
  console.log('🚀 ~ file: addProductToCart.ts ~ line 9 ~ data', data);
  console.log('🚀 ~ file: addProductToCart.ts ~ line 9 ~ product', product);
  console.log('🚀 ~ file: addProductToCart.ts ~ line 9 ~ setCartInfo', setCartInfo);
  console.log('🚀 ~ file: addProductToCart.ts ~ line 9 ~ city', city);
  console.log('🚀 ~ file: addProductToCart.ts ~ line 9 ~ country', country);
  console.log('🚀 ~ file: addProductToCart.ts ~ line 9 ~ orderType', orderType);

  setCartInfo((state) => {
    const prevState = state;
    const proto = {
      storeName: data?.storeName,
      image: data?.image,
      _id: data._id.toString(),
      city,
      country,
      storeType: data.storeType,
      coords: data.coords,
      orderType: orderType || 'Delivery',
      addedProducts: {
        [product._id.toString()]: {
          ...product,
          qty: 1,
        },
      },
    };

    if (Object.keys(prevState)?.length === 0) {
      return { [data._id.toString()]: proto };
    }

    const targetedStore = prevState[data._id.toString()];

    if (!targetedStore) {
      return { ...prevState, [data._id.toString()]: proto };
    }

    if (targetedStore) {
      // const isDefined = targetedStore?.addedProducts.hasOwnProperty(product._id.toString())
      // if(isDefined){

      // }
      const oldProduct = targetedStore?.addedProducts[product._id.toString()];

      if (oldProduct) {
        const newProduct = {
          ...oldProduct,
          qty: oldProduct.qty + 1,
        };

        const newState = {
          ...prevState,
          [targetedStore._id]: {
            ...prevState[targetedStore._id],
            addedProducts: {
              ...prevState[targetedStore._id].addedProducts,
              [newProduct._id]: newProduct,
            },
          },
        };

        return newState;
      }
      if (!oldProduct) {
        const newStore = {
          ...targetedStore,
          addedProducts: {
            ...targetedStore.addedProducts,
            [product._id.toString()]: {
              ...product,
              qty: 1,
            },
          },
        };

        const newState = { ...prevState, [newStore._id]: newStore };

        return newState;
      }
    }
  });
};
