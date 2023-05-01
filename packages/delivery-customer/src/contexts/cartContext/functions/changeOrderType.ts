import { showNotification } from "@mantine/notifications";
import {
  ORDER_TYPE_DELIVERY,
  ORDER_TYPE_PICKUP,
  STORE_TYPE_RESTAURANT,
} from "hyfn-types";
import { t } from "../../../util/i18nextFix";

export const changeOrderType = (orderType, setCartInfo: any) => {
  setCartInfo((prevInfo) => {
    const storesTypes = Object.keys(prevInfo).map((storeKey) => {
      return prevInfo[storeKey].storeType.includes(STORE_TYPE_RESTAURANT);
    });

    const isAllRestuarants = !storesTypes.includes(false);
    if (orderType === ORDER_TYPE_PICKUP) {
      showNotification({
        title: t("Only restuarants can take pickup orders"),
        message: t(""),
        autoClose: true,
      });
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
    //   [data._id.toString()]: {
    //     ...prevInfo[data._id.toString()],
    //     orderType,
    //   },
    // };

    return newStores;
  });
};
