import { t } from "i18next";

export const calculatePrecision = (measurementSystem: string) => {
  if (measurementSystem === "Kilo" || measurementSystem === "Liter") {
    return 2;
  }
  if (measurementSystem === "Unit") {
    return 0;
  }
};
export const calculateStep = (measurementSystem: string) => {
  if (measurementSystem === "Kilo" || measurementSystem === "Liter") {
    return 0.25;
  }
  if (measurementSystem === "Unit") {
    return 1;
  }
};

export const productCrumbsArray = ({
  crumbsMaker,
  params
}: {
  params: any;
  crumbsMaker: any;
}) => {
  return [
    { title: t("Home"), href: "/home" },
    {
      title: params.get("storeName"),
      href: crumbsMaker((storeParams) => {
        storeParams.append("storeName", params.get("storeName"));
        storeParams.append("storeId", params.get("storeId"));
        return `/storefront?${storeParams.toString()}`;
      })
    },
    {
      title: params.get("collectionName"),
      href: crumbsMaker((storeParams) => {
        storeParams.append("storeName", params.get("storeName"));
        storeParams.append("storeId", params.get("storeId"));
        storeParams.append("collectionName", params.get("collectionName"));
        storeParams.append("collectionId", params.get("collectionId"));
        return `/collection?${storeParams.toString()}`;
      })
    },
    {
      title: params.get("productName"),
      href: ""
    }
  ];
};
