import { Carousel } from '@mantine/carousel';
import { Box, Button, Center, Loader, Text } from '@mantine/core';
import Product from 'components/Product';
import { useCart } from 'contexts/cartContext/Provider';
import { useOnScreen } from 'hooks/useOnScreen';
import { t } from 'util/i18nextFix';;
import { useGetCollectionProducts } from 'pages/Collection/hooks/useGetCollectionProducts';
import React, { useEffect, useRef, useState } from 'react';

import { Link } from 'react-router-dom';

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
  const { setCartInfo, addProductToCart, reduceOrRemoveProductFromCart } = useCart();

  // const CustomRightArrow = ({ onClick, ...rest }: any) => {
  //   const {
  //     onMove,
  //     carouselState: { currentSlide, deviceType },
  //   } = rest;
  //   // onMove means if dragging or swiping in progress.
  //   return <Button onClick={() => onClick()} />;
  // };

  // const CustomLeftArrow = ({ onClick, ...rest }: any) => {
  //   const {
  //     onMove,
  //     carouselState: { currentSlide, deviceType },
  //   } = rest;
  //   // onMove means if dragging or swiping in progress.
  //   return <Button onClick={() => onClick()} />;
  // };

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
    storefront: storefront._id.toString(),
    documents: 5,
    isOnScreen,
  });
  console.log('🚀 ~ file: Collection.tsx:67 ~ products:', products);
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    console.log(
      '🚀 ~ file: Collection.tsx:145 ~ index:',
      slideIndex,
      products?.pages?.flatMap((product) => product)?.length - 1,
    );
    if (slideIndex === products?.pages?.flatMap((product) => product)?.length - 1) {
      fetchNextPage({
        pageParam:
          products?.pages[products.pages.length - 1][
            products?.pages[products.pages.length - 1].length - 1
          ]?._id?.toString(),
      });
    }
  }, [slideIndex, products]);
  return (
    <Box ref={elementRef} mb={63}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Text weight={700} sx={{ fontSize: '24px' }}>
          {collectionName}
        </Text>
        <Button
          variant="subtle"
          component={Link}
          to={`/collection/${storefront._id.toString()}/${collectionId}/${country}`}
          state={{ city, country, storeInfo: storefront }}
        >
          {t('show all')}
        </Button>
      </Box>
      {isLoading ? (
        <Loader />
      ) : (
        isFetched && (
          <Carousel
            // slidesToScroll={4}

            slideSize={'45%'}
            withIndicators
            align={'start'}
            // slideSize={'10%'}
            onSlideChange={(index) => {
              setSlideIndex(index);
            }}
            // autoPlay={false}
            // autoPlaySpeed={-999999999999}
            // draggable={false}
            // responsive={responsive}
          >
            {products?.pages?.map((page) => {
              return page?.map((product) => {
                const addProduct = () => {
                  addProductToCart(storefront, product, setCartInfo, city, country, orderType);
                };
                const reduceOrRemoveProduct = () => {
                  reduceOrRemoveProductFromCart(storefront, product, setCartInfo);
                };
                const productUrl = product?.options?.hasOptions
                  ? `/product/${storefront._id.toString()}/${country}/${city}/${product._id}`
                  : `/product/withnotoptions/${storefront._id.toString()}/${country}/${city}/${product._id}`;
                return (
                  <Carousel.Slide key={product?._id?.toString()}>
                    <Product
                      currency={storefront.currency}
                      product={product}
                      productUrl={productUrl}
                      orderType={orderType}
                      addProduct={addProduct}
                      addedProducts={addedProducts}
                      reduceOrRemoveProduct={reduceOrRemoveProduct}
                      //   likeMutation={likeMutation}
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
                    width: '100%',

                    height: '100%',

                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
