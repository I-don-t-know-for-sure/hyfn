import {
  Button,
  Card,
  Checkbox,
  Group,
  MultiSelect,
  Paper,
  Stack,
  TransferList,
  TransferListData,
} from "@mantine/core";
import { t } from "utils/i18nextFix";

import React, { useEffect, useState } from "react";
import { useGetCollectionProducts } from "../hooks/useGetCollectionProducts";

import { useGetProductsForCollection } from "../hooks/useGetProductsForCollection";

import { CollectionCard } from "../types";

interface ProductsSelectionProps extends CollectionCard {
  collectionId?: string;
}

const ProductsSelection: React.FC<ProductsSelectionProps> = ({
  collectionInfo,
  collectionId,
  onChangeHandler,
}) => {
  const [checked, setChecked] = useState(!collectionId);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const {
    data,
    isLoading,
    isFetched,
    fetchNextPage,
    isFetchingNextPage,
    isIdle,
  } = useGetCollectionProducts({
    collectionId,
    checked,
  });

  const {
    data: products,
    isLoading: areProductsLoading,
    isFetched: areProductsFetched,
    fetchNextPage: fetchNextProducts,
    isFetchingNextPage: isFetchingNextProducts,
    isIdle: areProductsIdle,
  } = useGetProductsForCollection({ collectionId, checked });
  const [transferValue, setTransferValue] = useState<TransferListData>([
    [],
    [],
  ]);

  // const {
  //   data: storeFrontProducts = [],
  //   isFetched: areStoreFrontProductsFetched,
  //   isLoading: areStoreFrontProductsLoading,
  //   isIdle: areStoreFrontProductsIdle,
  // } = useGetCollectionStoreFrontProducts({ collectionId, checked });

  // useEffect(() => {
  //   if (
  //     (areStoreFrontProductsFetched && !areStoreFrontProductsLoading) ||
  //     (!collectionId && checked)
  //   ) {
  //     const filteredStoreFront = storeFrontTransferList[1]?.filter(
  //       (oldProduct) => {
  //         const isProductInStoreFront = storeFrontProducts?.find(
  //           (product) => oldProduct.value === product.value
  //         );
  //         return !isProductInStoreFront;
  //       }
  //     );

  //     onChangeHandler(filteredStoreFront, "addedStoreFrontProducts");

  //     if (collectionId) {
  //       const removedStoreFrontProducts = storeFrontProducts?.filter(
  //         (oldProduct) => {
  //           const isProductInTransferList = storeFrontTransferList[1]?.find(
  //             (product) => oldProduct.value === product.value
  //           );
  //           return !isProductInTransferList;
  //         }
  //       );

  //       onChangeHandler(removedStoreFrontProducts, "removedStoreFrontProducts");
  //     }
  //   }
  // }, [storeFrontTransferList]);

  // useEffect(() => {
  //   if (storeFrontProducts?.length > 0) {
  //     setStoreFrontTransferList((prevState) => [
  //       prevState[0],
  //       storeFrontProducts || [],
  //     ]);
  //   }
  // }, [storeFrontProducts]);

  ///////////////////////////////////////////////////
  useEffect(() => {
    if (!isFetchingNextPage && data?.pages?.length > 1) {
      const mappedProducts = data?.pages[data?.pages?.length - 1];
      setTransferValue((prevState) => [
        prevState[0],
        [...prevState[1], ...mappedProducts],
      ]);
      setCollectionProducts((prevState) => [...prevState, ...mappedProducts]);
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    if (!isFetchingNextProducts && products?.pages?.length > 1) {
      const mappedProducts = products?.pages[products?.pages?.length - 1];

      setTransferValue((prevState) => [
        [...prevState[0], ...mappedProducts],
        prevState[1],
      ]);
    }
  }, [isFetchingNextProducts]);

  useEffect(() => {
    if (products?.pages?.length === 1) {
      const mappedProducts = products?.pages?.flatMap((page) => page);
      setTransferValue((prevState) => [mappedProducts, prevState[1]]);
    }
  }, [areProductsFetched, areProductsLoading, products]);

  useEffect(() => {
    if (data?.pages?.length === 1) {
      const mappedProducts = data?.pages?.flatMap((page) => page);
      setTransferValue((prevState) => [prevState[0], mappedProducts]);
      setCollectionProducts(mappedProducts);
    }
  }, [isLoading, data, isFetched]);

  useEffect(() => {
    const addedProducts = transferValue[1].filter((newProduct) => {
      const productAlreadyInCollection = collectionProducts.find(
        (oldProduct) => {
          return newProduct.value === oldProduct.value;
        }
      );
      return !productAlreadyInCollection;
    });

    onChangeHandler(addedProducts, "addedProductsArray");

    if (collectionId) {
      const newValue = collectionProducts.filter((product) => {
        const isProductAdded = transferValue[1].find(
          (item) => item.value === product.value
        );
        if (!isProductAdded) return true;
        return false;
      });

      onChangeHandler(newValue, "removedProductsArray");
    }
  }, [transferValue]);

  // const dependencyArray =
  //   !collectionId && checked
  //     ? [transferValue]
  //     : [storeFrontProducts, transferValue];

  // useEffect(() => {
  //   if (
  //     !areStoreFrontProductsLoading &&
  //     (areStoreFrontProductsFetched || (!collectionId && checked))
  //   ) {
  //     const filteredCollectionProducts = transferValue[1].filter((product) => {
  //       const isProductInStoreFront = storeFrontProducts?.find(
  //         ({ value }) => value === product.value
  //       );
  //       return !isProductInStoreFront;
  //     });
  //     setStoreFrontTransferList((prevState) => [
  //       filteredCollectionProducts,
  //       prevState[1],
  //     ]);
  //   }
  // }, dependencyArray);

  return (
    <Paper shadow={"lg"}>
      <Checkbox
        label={t("Manage collection products")}
        checked={checked}
        onChange={() => setChecked(!checked)}
        mb={checked ? 18 : 0}
      />
      <Stack>
        {checked && (
          <>
            <TransferList
              titles={[t("All products"), t("Collection Products")]}
              value={transferValue}
              onChange={setTransferValue}
              showTransferAll={false}
            />
            <Group position="apart" mt={8}>
              <Button
                onClick={() => {
                  fetchNextProducts({
                    pageParam:
                      products?.pages[products?.pages?.length - 1][
                        products?.pages[products.pages?.length - 1]?.length - 1
                      ]?.value,
                  });
                }}
              >
                {t("More")}
              </Button>
              <Button
                onClick={() => {
                  fetchNextPage({
                    pageParam:
                      data?.pages[data?.pages?.length - 1][
                        data?.pages[data.pages?.length - 1]?.length - 1
                      ]?.value,
                  });
                }}
              >
                {t("More")}
              </Button>
            </Group>
          </>
        )}
        {/* {checked && (
          <>
            <TransferList
              titles={[t("Collection products"), t("StoreFront products")]}
              value={storeFrontTransferList}
              onChange={setStoreFrontTransferList}
              showTransferAll={false}
            />
            <Group position="apart" mt={8}>
              <Button
                onClick={() => {
                  fetchNextPage({
                    pageParam:
                      data?.pages[data?.pages?.length - 1][
                        data?.pages[data.pages?.length - 1]?.length - 1
                      ]?.value,
                  });
                }}
              >
                {t("More")}
              </Button>
            </Group>
          </>
        )} */}
      </Stack>
    </Paper>
  );
};

export default ProductsSelection;
