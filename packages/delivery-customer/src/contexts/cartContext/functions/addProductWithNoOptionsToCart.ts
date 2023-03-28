import { removeFromCart } from './removeFromCart';

export const addProductWithNoOptionsToCart = (
  data: any,
  product: any,
  setCartInfo: any,
  city: string,
  country: string,
  orderType?: string,
) => {
  console.log('shsshhshshshshhsshsh');

  if (product.qty === 0) {
    removeFromCart(data, product, setCartInfo);
    return;
  }
  setCartInfo((prevState) => {
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
        },
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
      const newStoreProducts = {
        ...targetedStore.addedProducts,
        [product._id.toString()]: {
          ...product,

          _id: product._id.toString(),
        },
      };

      const newState = {
        ...prevState,
        [data._id.toString()]: {
          ...targetedStore,
          addedProducts: newStoreProducts,
        },
      };

      return newState;
    }
  });
};
