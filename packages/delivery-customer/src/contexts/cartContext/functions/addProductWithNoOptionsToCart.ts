import { removeFromCart } from "./removeFromCart";

export const addProductWithNoOptionsToCart = (
  data: any,
  product: any,
  setCartInfo: any,
  city: string,
  country: string,
  orderType?: string
) => {
  console.log("shsshhshshshshhsshsh");

  if (product.qty === 0) {
    removeFromCart(data, product, setCartInfo);
    return;
  }
  setCartInfo((prevState) => {
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
        },
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
      const newStoreProducts = {
        ...targetedStore.addedProducts,
        [product.id]: {
          ...product,

          id: product.id,
        },
      };

      const newState = {
        ...prevState,
        [data.id]: {
          ...targetedStore,
          addedProducts: newStoreProducts,
        },
      };

      return newState;
    }
  });
};
