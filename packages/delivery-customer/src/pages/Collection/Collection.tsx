import { Box, Container, Loader, SimpleGrid, Text } from "@mantine/core";
import Product from "./components/Product";
import { useCart } from "../../contexts/cartContext/Provider";
import { storeFront } from "../../config/types";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useGetCollectionProducts } from "./hooks/useGetCollectionProducts";
import { useLikeProduct } from "../../pages/Product/hooks/useProduct";
import { t } from "../../util/i18nextFix";
import { useWindowScroll } from "@mantine/hooks";
interface CollectionProps {}

const Collection: React.FC<CollectionProps> = ({}) => {
  const [scroll] = useWindowScroll();

  const { storefront, collectionid } = useParams();

  const location = useLocation();
  const { city, country, storeInfo } = location.state as {
    city: string;
    country: string;
    storeInfo: storeFront;
  };

  const { data, isLoading, isError, fetchNextPage } = useGetCollectionProducts({
    collectionid,
    country,
    storefront,
  });

  useEffect(() => {
    console.log(
      window.innerHeight + window.scrollY >= document.body.offsetHeight
    );

    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      Array.isArray(data?.pages)
    ) {
      fetchNextPage({ pageParam: data.pages[data.pages.length - 1][24]?.id });
      console.log(data.pages[data.pages.length - 1][24]?.id);
    }
  }, [scroll]);

  console.log(data);
  const { addProductToCart, reduceOrRemoveProductFromCart, cart, setCartInfo } =
    useCart();

  const { mutate: likeMutation } = useLikeProduct();
  const addedProducts = cart[storeInfo?.id]?.addedProducts;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Text>{t("Error")}</Text>
      ) : (
        data && (
          <SimpleGrid
            sx={(theme) => ({
              width: "100%",
              margin: "auto",

              [theme.fn.largerThan("md")]: {
                gridTemplateColumns: "repeat(2, 1fr)",
              },
              [theme.fn.largerThan("lg")]: {
                gridTemplateColumns: "repeat(3, 1fr)",
              },
              [theme.fn.smallerThan("md")]: {
                gridTemplateColumns: "repeat(2, 1fr)",
              },
              [theme.fn.smallerThan("sm")]: {
                gridTemplateColumns: "repeat(1, 1fr)",
              },
              [theme.fn.smallerThan("xs")]: {
                gridTemplateColumns: "repeat(1, 1fr)",
              },
              // display: "flex",
              // flexWrap: "wrap",
              // justifyContent: "space-between",
            })}
            cols={3}
            breakpoints={[
              {
                maxWidth: "lg",
                cols: 2,
                spacing: "md",
              },
              {
                maxWidth: "md",
                cols: 2,
                spacing: "sm",
              },
              {
                maxWidth: "sm",
                cols: 3,
                spacing: "md",
              },
            ]}
          >
            {data?.pages?.map((chunck) => {
              return chunck?.map((product) => {
                const addProduct = () => {
                  console.log("add ................", product, storeInfo);

                  addProductToCart(
                    storeInfo,
                    product,
                    setCartInfo,
                    city,
                    country
                  );
                };
                const reduceOrRemoveProduct = () => {
                  console.log("reduce ................", storeInfo, product);

                  reduceOrRemoveProductFromCart(
                    storeInfo,
                    product,
                    setCartInfo
                  );
                };
                const productUrl = product?.hasOptions
                  ? `/product/${storeInfo?.id}/${country}/${city}/${product?.id}`
                  : `/product/withnotoptions/${storeInfo?.id}/${country}/${city}/${product?.id}`;
                return (
                  <Product
                    key={product?.id}
                    product={product}
                    productUrl={productUrl}
                    addProduct={addProduct}
                    addedProducts={addedProducts}
                    reduceOrRemoveProduct={reduceOrRemoveProduct}
                    // likeMutation={likeMutation}
                    city={city}
                    country={country}
                    storefront={storeInfo?.id}
                  />
                );
              });
            })}
          </SimpleGrid>
        )
      )}
    </Box>
  );
};

export default Collection;
