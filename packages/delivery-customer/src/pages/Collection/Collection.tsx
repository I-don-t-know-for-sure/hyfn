import {
  Box,
  Breadcrumbs,
  Container,
  Loader,
  SimpleGrid,
  Stack,
  Text
} from "@mantine/core";
import Product from "./components/Product";
import { useCart } from "../../contexts/cartContext/Provider";
import { storeFront } from "../../config/types";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useGetCollectionProducts } from "./hooks/useGetCollectionProducts";
import { useLikeProduct } from "../../pages/Product/hooks/useProduct";
import { t } from "../../util/i18nextFix";
import { useWindowScroll } from "@mantine/hooks";
import { crumbs, useURLParams } from "hyfn-client";
import { useGetStoreFront } from "pages/StoreFront/hooks/useGetStoreFront";
interface CollectionProps {}

const Collection: React.FC<CollectionProps> = ({}) => {
  const [scroll] = useWindowScroll();

  // const { storefront, collectionid } = useParams();

  // const location = useLocation();
  // const { city, country, storeInfo } = location.state as {
  //   city: string;
  //   country: string;
  //   storeInfo: storeFront;
  // };
  const { params } = useURLParams();
  const collectionid = params.get("collectionId");
  const storeId = params.get("storeId");
  // const storefrontHref = new URLSearchParams();
  // storefrontHref.append("storeName", params.get("storeName"));
  // storefrontHref.append("storeId", params.get("storeId"));
  const storefrontHref = new URLSearchParams(params.toString());
  storefrontHref.delete("collectionId");
  storefrontHref.delete("collectionName");
  const crumbsArray = [
    { title: t("Home"), href: "/home" },
    {
      title: params.get("storeName"),
      href: `/storefront?${storefrontHref.toString()}`
    },
    { title: params.get("collectionName"), href: "" }
  ];
  const { data: storeInfo, isLoading: storefrontLoading } = useGetStoreFront({
    storefront: storeId
  });
  const { data, isLoading, isError, fetchNextPage } = useGetCollectionProducts({
    collectionid,
    storeId,
    enabled: !storefrontLoading && !!storeInfo

    // storefront
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

  const addedProducts = cart[storeId]?.addedProducts;

  return (
    <Container>
      <Stack

      // sx={{
      //   width: "100%",
      //   display: "flex",
      //   flexDirection: "column",
      //   alignItems: "center"
      // }
      // }
      >
        <Breadcrumbs>{crumbs({ items: crumbsArray })}</Breadcrumbs>
        {isLoading || storefrontLoading ? (
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
                  gridTemplateColumns: "repeat(2, 1fr)"
                },
                [theme.fn.largerThan("lg")]: {
                  gridTemplateColumns: "repeat(3, 1fr)"
                },
                [theme.fn.smallerThan("md")]: {
                  gridTemplateColumns: "repeat(2, 1fr)"
                },
                [theme.fn.smallerThan("sm")]: {
                  gridTemplateColumns: "repeat(1, 1fr)"
                },
                [theme.fn.smallerThan("xs")]: {
                  gridTemplateColumns: "repeat(1, 1fr)"
                }
                // display: "flex",
                // flexWrap: "wrap",
                // justifyContent: "space-between",
              })}
              cols={3}
              breakpoints={[
                {
                  maxWidth: "lg",
                  cols: 2,
                  spacing: "md"
                },
                {
                  maxWidth: "md",
                  cols: 2,
                  spacing: "sm"
                },
                {
                  maxWidth: "sm",
                  cols: 3,
                  spacing: "md"
                }
              ]}>
              {data?.pages?.map((chunck) => {
                return chunck?.map((product) => {
                  const addProduct = () => {
                    // console.log("add ................", product, storeInfo);

                    addProductToCart(
                      storeInfo,
                      product,
                      setCartInfo
                      // city,
                      // country
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
                  const productParams = new URLSearchParams(params.toString());
                  productParams.append("productId", product?.id);
                  productParams.append("productName", product?.title);

                  const productUrl = product?.hasOptions
                    ? `/product?${productParams.toString()}`
                    : `/product/withnotoptions?${productParams.toString()}`;

                  return (
                    <Product
                      key={product?.id}
                      product={product}
                      productUrl={productUrl}
                      addProduct={addProduct}
                      addedProducts={addedProducts}
                      reduceOrRemoveProduct={reduceOrRemoveProduct}
                      // likeMutation={likeMutation}
                      // city={city}
                      // country={country}
                    />
                  );
                });
              })}
            </SimpleGrid>
          )
        )}
      </Stack>
    </Container>
  );
};

export default Collection;
