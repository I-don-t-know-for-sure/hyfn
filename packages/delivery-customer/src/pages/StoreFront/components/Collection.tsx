import { Carousel } from "@mantine/carousel";
import { Box, Button, Center, Loader, Text } from "@mantine/core";
import Product from "components/Product";
import { useCart } from "contexts/cartContext/Provider";
import { useOnScreen } from "hooks/useOnScreen";
import { t } from "util/i18nextFix";
import { useGetCollectionProducts } from "pages/Collection/hooks/useGetCollectionProducts";
import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import { getPagesLength } from "hyfn-client";

interface CollectionProps {
  collectionName: string;
  collectionId: string;
  responsive: any;
  orderType: string;
  storefront: any;
  country: string;
  city: string;
  addedProducts: any;
}

const Collection: React.FC<CollectionProps> = ({
  collectionName,
  orderType,
  responsive,
  storefront,
  country,
  city,
  collectionId,
  addedProducts,
}) => {
  const { setCartInfo, addProductToCart, reduceOrRemoveProductFromCart } =
    useCart();

  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef);
  const {
    data: products,
    fetchNextPage,
    isLoading,
    isFetched,
    isFetchingNextPage,
  } = useGetCollectionProducts({
    collectionid: collectionId,
    country: country,
    storefront: storefront.id,
    documents: 5,
    isOnScreen,
  });
  console.log("🚀 ~ file: Collection.tsx:67 ~ products:", products);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideIndexChanged, setSlideIndexChanged] = useState(false);
  useEffect(() => {
    console.log(
      "🚀 ~ file: Collection.tsx:145 ~ index:",
      slideIndex,
      products?.pages?.flatMap((product) => product)?.length - 1
    );
    if (
      slideIndex ===
        products?.pages?.flatMap((product) => product)?.length - 1 &&
      slideIndexChanged
    ) {
      fetchNextPage({
        pageParam: getPagesLength(products),
      });
      setSlideIndexChanged(false);
    }
  }, [slideIndex, products]);
  return (
    <Box ref={elementRef} mb={63}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text weight={700} sx={{ fontSize: "24px" }}>
          {collectionName}
        </Text>
        <Button
          variant="subtle"
          component={Link}
          to={`/collection/${storefront.id}/${collectionId}/${country}`}
          state={{ city, country, storeInfo: storefront }}
        >
          {t("show all")}
        </Button>
      </Box>
      {isLoading ? (
        <Loader />
      ) : (
        isFetched && (
          <Carousel
            // slidesToScroll={4}
            height="100%"
            sx={{ flex: 1 }}
            slideSize={"45%"}
            withIndicators={false}
            align={"start"}
            // slideSize={'10%'}
            onSlideChange={(index) => {
              setSlideIndex(index);
              setSlideIndexChanged(true);
            }}
            // autoPlay={false}
            // autoPlaySpeed={-999999999999}
            // draggable={false}
            // responsive={responsive}
          >
            {products?.pages?.map((page) => {
              return page?.map((product) => {
                const addProduct = () => {
                  addProductToCart(
                    storefront,
                    product,
                    setCartInfo,
                    city,
                    country,
                    orderType
                  );
                };
                const reduceOrRemoveProduct = () => {
                  reduceOrRemoveProductFromCart(
                    storefront,
                    product,
                    setCartInfo
                  );
                };
                const productUrl = product?.hasOptions
                  ? `/product/${storefront.id}/${country}/${city}/${product.id}`
                  : `/product/withnotoptions/${storefront.id}/${country}/${city}/${product.id}`;
                return (
                  <Carousel.Slide
                    sx={{
                      width: "fit-content",
                    }}
                    key={product?.id}
                  >
                    <Product
                      currency={storefront.currency}
                      product={product}
                      productUrl={productUrl}
                      orderType={orderType}
                      addProduct={addProduct}
                      addedProducts={addedProducts}
                      reduceOrRemoveProduct={reduceOrRemoveProduct}
                      city={city}
                      country={country}
                      storefront={storefront}
                    />
                  </Carousel.Slide>
                );
              });
            })}
            {isFetchingNextPage && (
              <Carousel.Slide>
                <Box
                  sx={{
                    width: "100%",

                    height: "100%",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loader />
                </Box>
                {/* <Center></Center> */}
              </Carousel.Slide>
            )}
          </Carousel>
        )
      )}
    </Box>
  );
};

export default Collection;
