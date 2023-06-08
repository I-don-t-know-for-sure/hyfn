import { orderTypesObject, storeTypesObject } from "hyfn-types";

export const changeOrderType = (orderType, setCartInfo: any) => {
  setCartInfo((prevInfo) => {
    const storesTypes = Object.keys(prevInfo).map((storeKey) => {
      return prevInfo[storeKey].storeType.includes(storeTypesObject.restaurant);
    });

    const isAllRestuarants = !storesTypes.includes(false);
    if (orderType === orderTypesObject.Pickup) {
    }
    console.log(storesTypes, isAllRestuarants);

    // if (isAllRestuarants) {
    const newStores = Object.keys(prevInfo).map((storeKey) => {
      return { ...prevInfo[storeKey], orderType };
    });
    return newStores;
    // }

    // const newStores = Object.keys(prevInfo).map((storeKey) => {
    //   return { ...prevInfo[storeKey], orderType: ORDER_TYPE_DELIVERY };
    // });
    // const newState = {
    //   ...prevInfo,
    //   [data.id.toString()]: {
    //     ...prevInfo[data.id.toString()],
    //     orderType,
    //   },
    // };

    return newStores;
  });
};
