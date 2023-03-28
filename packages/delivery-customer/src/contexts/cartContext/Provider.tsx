import { useLocalStorage } from '@mantine/hooks';
import React, { createContext, useContext } from 'react';
// import { UserContextApi } from "./types";
import usePersistState from '../../hooks/usePersistState';
// userInfo : {}
// updaters: () => {}
import { changeOrderType } from './functions/changeOrderType';
import { addProductWithNoOptionsToCart } from './functions/addProductWithNoOptionsToCart';

import { clearCart } from './functions/clearCart';

import { removeProductWithOptionsFromCart } from './functions/removeProductWithOptionsFromCart';
import { updateProductWithOptions } from './functions/updateProductWithOptions';
import { addProductWithOptionsToCart } from './functions/addProductWithOptionsToCart';
import { removeFromCart } from './functions/removeFromCart';
import { reduceOrRemoveProductFromCart } from './functions/reduceOrRemoveProductFromCart';
import { addProductToCart } from './functions/addProductToCart';
import { updateInstructions } from './functions/updateInstructions';
import { changeStoreOrderType } from './functions/changeStoreOrderType';

export const CartContext = createContext(undefined);

const CartProvider: React.FC = ({ children }) => {
  // make this type safe
  // const updateUserInfo = useCallback(
  //   (newInfo: any) => {
  //     newInfo);
  //     setUserInfo((prev) => {
  //       return { ...prev, ...newInfo };
  //     });
  //   },
  //   [setUserInfo]
  // );
  const [cart, setCartInfo] = useLocalStorage({
    key: 'cart',
    defaultValue: {},
  });
  // const updateInstructions = (
  //   store: any,
  //   product: any,
  //   instructions: string
  // ) => {
  //   const targetedStore = cart.find((potentialStore) => {
  //     return potentialStore._id === store._id;
  //   });

  //   setCartInfo((prevState) => {
  //     return prevState.map((store) => {
  //       if (store._id === targetedStore._id) {
  //         return {
  //           ...targetedStore,
  //           addedProducts: targetedStore.addedProducts.map(
  //             (potentialProduct) => {
  //               if (potentialProduct._id === product._id.toString()) {
  //                 return { ...potentialProduct, instructions };
  //               }
  //               return potentialProduct;
  //             }
  //           ),
  //         };
  //       }
  //       return store;
  //     });
  //   });
  // };

  return (
    <CartContext.Provider
      value={{
        addProductToCart,
        reduceOrRemoveProductFromCart,
        removeFromCart,
        updateInstructions,
        addProductWithOptionsToCart,
        updateProductWithOptions,
        removeProductWithOptionsFromCart,
        clearCart,
        addProductWithNoOptionsToCart,
        changeOrderType,
        changeStoreOrderType,
        setCartInfo,
        cart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error('call inside the component tree');
  }

  return cart;
};

export default CartProvider;
/* 
const addProductWithNoOptionsToCart = (
    data: any,
    product: any,
    city: string,
    country: string,
    orderType?: string
  ) => {
    setCartInfo((prevState) => {
      const proto = {
        storeName: data?.businessName,
        image: data?.image,
        _id: data._id.toString(),
        city,
        country,
        coords: data.coords,
        orderType: orderType || "Delivery",
        addedProducts: [
          {
            ...product,

            _id: product._id.toString(),
          },
        ],
      };
      if (!(prevState?.length > 0)) {
        return [proto];
      }

      const targetedStore = prevState.find((store) => {
        return store._id === data._id.toString();
      });

      if (!targetedStore) {
        return [...prevState, proto];
      }

      if (targetedStore) {
        const newStoreProducts = targetedStore.addedProducts.map(
          (oldProduct) => {
            if (product._id.toString() === oldProduct._id) {
              return {
                ...product,

                _id: product._id.toString(),
              };
            }
            return oldProduct;
          }
        );
        //
        return prevState.map((oldStore) => {
          if (oldStore._id === data._id.toString()) {
            return { ...targetedStore, addedProducts: newStoreProducts };
          }
          return oldStore;
        });
      }
    });
  };
  const addProductToCart = (
    data: any,
    product: any,
    city: string,
    country: string,
    orderType: string
  ) => {
    setCartInfo((prevState) => {
      const proto = {
        storeName: data?.businessName,
        image: data?.image,
        _id: data._id.toString(),
        city,
        country,
        coords: data.coords,
        orderType: orderType || "Delivery",
        addedProducts: [
          {
            ...product,
            qty:
              product.measurementSystem === "Unit"
                ? 1
                : product.measurementSystem === "Kilo" ||
                  product.measurementSystem === "Liter"
                ? 0.25
                : 0.05,
            _id: product._id.toString(),
          },
        ],
      };

      if (!(prevState?.length > 0)) {
        return [proto];
      }

      const targetedStore = prevState.find((store) => {
        return store._id === data._id.toString();
      });

      if (!targetedStore) {
        return [...prevState, proto];
      }

      if (targetedStore) {
        const oldProduct = targetedStore.addedProducts.find((old) => {
          return old._id === product._id.toString();
        });

        if (oldProduct) {
          const newProduct = {
            ...oldProduct,
            qty:
              product.measurementSystem === "Unit"
                ? oldProduct.qty + 1
                : product.measurementSystem === "Kilo" ||
                  product.measurementSystem === "Liter"
                ? oldProduct.qty + 0.25
                : oldProduct.qty + 0.05,
          };
          const newState = prevState.map((oldStore) => {
            if (oldStore._id === targetedStore._id) {
              const newProducts = targetedStore.addedProducts?.map(
                (product) => {
                  if (product._id === newProduct._id) {
                    return newProduct;
                  }
                  return product;
                }
              );

              return {
                ...oldStore,
                addedProducts: newProducts,
              };
            }
            return oldStore;
          });

          return newState;
        }
        if (!oldProduct) {
          const newStore = {
            ...targetedStore,
            addedProducts: [
              ...targetedStore.addedProducts,
              {
                ...product,
                qty:
                  product.measurementSystem === "Unit"
                    ? 1
                    : product.measurementSystem === "Kilo" ||
                      product.measurementSystem === "Liter"
                    ? 0.25
                    : 0.05,
                _id: product._id.toString(),
              },
            ],
          };

          return prevState.map((oldStore) => {
            if (oldStore._id === newStore._id) {
              return newStore;
            }
            return oldStore;
          });
        }
      }
    });
  };

  const updateProductWithOptions = (data: any, product: any) => {
    setCartInfo((prevState) => {
      const targetedStore = prevState.find((store) => {
        return store._id === data._id.toString();
      });

      if (targetedStore) {
        const oldProduct = targetedStore.addedProducts.find((old) => {
          return old.key === product.key;
        });

        const newState = prevState.map((oldStore) => {
          if (oldStore._id === targetedStore._id) {
            const newProducts = targetedStore.addedProducts?.map(
              (oldProduct) => {
                if (oldProduct.key === product.key) {
                  return product;
                }
                return oldProduct;
              }
            );

            return {
              ...oldStore,
              addedProducts: newProducts,
            };
          }
          return oldStore;
        });

        return newState;
      }
    });
  };

  const removeProductWithOptionsFromCart = (data: any, product: any) => {
    setCartInfo((prevState) => {
      const targetedStore = prevState.find((store) => {
        return store._id === data._id.toString();
      });

      if (targetedStore) {
        const newProducts = targetedStore.addedProducts.filter((old) => {
          return old.key !== product.key;
        });

        if (!(newProducts.length > 0)) {
          return prevState.filter((oldStore) => {
            return oldStore._id !== targetedStore._id;
          });
        }
        const newState = prevState.map((oldStore) => {
          if (oldStore._id === targetedStore._id) {
            return {
              ...oldStore,
              addedProducts: newProducts,
            };
          }
          return oldStore;
        });

        return newState;
      }
    });
  };

  const removeFromCart = (data: any, product: any) => {
    setCartInfo((prevState) => {
      const targetedStore = prevState.find((store) => {
        return store._id === data._id.toString();
      });

      if (targetedStore) {
        const newProducts = targetedStore.addedProducts.filter((old) => {
          return old._id !== product._id.toString();
        });

        if (!(newProducts.length > 0)) {
          return prevState.filter((oldStore) => {
            return oldStore._id !== targetedStore._id;
          });
        }
        const newState = prevState.map((oldStore) => {
          if (oldStore._id === targetedStore._id) {
            return {
              ...oldStore,
              addedProducts: newProducts,
            };
          }
          return oldStore;
        });

        return newState;
      }
    });
  };

  const reduceOrRemoveProductFromCart = (data: any, product: any) => {
    setCartInfo((prevState) => {
      const targetedStore = prevState.find((store) => {
        return store._id === data._id.toString();
      });

      if (targetedStore) {
        const oldProduct = targetedStore.addedProducts.find((old) => {
          return old._id === product._id.toString();
        });

        if (oldProduct && oldProduct.qty > 1) {
          const newProduct = {
            ...oldProduct,
            qty:
              product.measurementSystem === "Unit"
                ? oldProduct.qty - 1
                : product.measurementSystem === "Kilo" ||
                  product.measurementSystem === "Liter"
                ? oldProduct.qty - 0.25
                : oldProduct.qty - 0.05,
          };
          const newState = prevState.map((oldStore) => {
            if (oldStore._id === targetedStore._id) {
              const newProducts = targetedStore.addedProducts?.map(
                (product) => {
                  if (product._id === newProduct._id) {
                    return newProduct;
                  }
                  return product;
                }
              );
              return {
                ...oldStore,
                addedProducts: newProducts,
              };
            }
            return oldStore;
          });

          return newState;
        }
        if (!(oldProduct.qty > 1)) {
          const newProducts = targetedStore.addedProducts.filter(
            (oldProduct) => oldProduct._id !== product._id.toString()
          );

          if (!(newProducts.length > 0)) {
            return prevState.filter((oldStore) => {
              return oldStore._id !== targetedStore._id;
            });
          }
          const newStore = {
            ...targetedStore,
            addedProducts: [...newProducts],
          };

          return prevState.map((oldStore) => {
            if (oldStore._id === newStore._id) {
              return newStore;
            }
            return oldStore;
          });
        }
      }
    });
  };

  const changeOrderType = (data, orderType) => {
    setCartInfo((prevInfo) => {
      return prevInfo.map((store) => {
        if (store._id === data._id.toString()) {
          return {
            ...store,
            orderType,
          };
        }
        return store;
      });
    });
  };

  const clearCart = () => {
    setCartInfo([]);
  };
*/
