export const addProductToCart = (
  data: any,
  product: any,
  setCartInfo: any,
  city?: string,
  country?: string,
  orderType?: string
) => {
  console.log("🚀 ~ file: addProductToCart.ts ~ line 9 ~ data", data);
  console.log("🚀 ~ file: addProductToCart.ts ~ line 9 ~ product", product);
  console.log(
    "🚀 ~ file: addProductToCart.ts ~ line 9 ~ setCartInfo",
    setCartInfo
  );
  console.log("🚀 ~ file: addProductToCart.ts ~ line 9 ~ city", city);
  console.log("🚀 ~ file: addProductToCart.ts ~ line 9 ~ country", country);
  console.log("🚀 ~ file: addProductToCart.ts ~ line 9 ~ orderType", orderType);

  setCartInfo((state) => {
    const prevState = state;
    const proto = {
      storeName: data?.storeName,
      image: data?.image,
      id: data.id,
      city,
      country,
      storeType: data.storeType,
      coords: data.coords,
      orderType: orderType || "Delivery",
      addedProducts: {
        [product.id]: {
          ...product,
          qty: 1,
        },
      },
    };

    if (Object.keys(prevState)?.length === 0) {
      return { [data.id]: proto };
    }

    const targetedStore = prevState[data.id];

    if (!targetedStore) {
      return { ...prevState, [data.id]: proto };
    }

    if (targetedStore) {
      // const isDefined = targetedStore?.addedProducts.hasOwnProperty(product.id)
      // if(isDefined){

      // }
      const oldProduct = targetedStore?.addedProducts[product.id];

      if (oldProduct) {
        const newProduct = {
          ...oldProduct,
          qty: oldProduct.qty + 1,
        };

        const newState = {
          ...prevState,
          [targetedStore.id]: {
            ...prevState[targetedStore.id],
            addedProducts: {
              ...prevState[targetedStore.id].addedProducts,
              [newProduct.id]: newProduct,
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
            [product.id]: {
              ...product,
              qty: 1,
            },
          },
        };

        const newState = { ...prevState, [newStore.id]: newStore };

        return newState;
      }
    }
  });
};
