import {
  ActionIcon,
  AspectRatio,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  NumberInput,
  NumberInputHandlers,
  Space,
  Stack,
  Text
} from "@mantine/core";
import { useCart } from "../../contexts/cartContext/Provider";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

import Image from "../../components/Image";
import { Image as CoreImage, crumbs, useURLParams } from "hyfn-client";
import { useFixedComponent } from "../../contexts/fixedComponentContext/FixedComponentProvider";

import { randomId } from "@mantine/hooks";
import { t } from "../../util/i18nextFix";
import { useGetProduct } from "./hooks/useGetProduct";
import { storeServiceFee } from "hyfn-types";
import { ImageModal } from "hyfn-client";
import { useImage } from "contexts/imageContext/ImageProvider";
import HtmlRenderer from "components/HtmlReader";
import {
  calculatePrecision,
  calculateStep,
  productCrumbsArray
} from "./functions";
import { Carousel } from "@mantine/carousel";

interface ProductWithoutOptionsProps {}

const ProductWithoutOptions: React.FC<ProductWithoutOptionsProps> = ({}) => {
  const { url, screenSizes } = useImage();

  // const { storefront, country, city, productId } = useParams<{
  //   storefront: string;
  //   country: string;
  //   city: string;
  //   productId: string;
  // }>();
  const { params, crumbsMaker } = useURLParams();
  const storefront = params.get("storeId");
  const productId = params.get("productId");
  // const { state } = useLocation();
  // const { orderType } = state as { orderType: string };
  const [product, setProduct] = useState<any>();
  const [storeDoc, setStore] = useState<any>();

  const {
    data = {},
    isLoading,
    isFetched,
    isError,
    error
  } = useGetProduct({ storefront, productId }, true);
  const [, setFixedComponent] = useFixedComponent();
  const handlers = useRef<NumberInputHandlers>();
  const { addProductWithNoOptionsToCart, setCartInfo, cart } = useCart();
  const orderType = cart[storefront]?.orderType
    ? cart[storefront]?.orderType
    : "Delivery";
  const check = cart[storefront]?.addedProducts[productId];
  const productFromCart = check ? check : [];
  const [qty, setQty] = useState(
    productFromCart?.qty ? productFromCart?.qty : 0
  );

  console.log(productFromCart);

  useEffect(() => {
    if (data && !isLoading) {
      setProduct(data.product);
      setStore(data.storeDoc);
      console.log(data);
    }
  }, [isFetched, productId]);

  // const decreaseQTY = () => {
  //   // setQty((qty) => (qty > 1 ? qty - 1 : qty));
  //   reduceOrRemoveProductFromCart(data?.storeDoc, data?.product);
  // };
  // const increaseQTY = () => {
  //   // setQty((qty) => qty + 1);
  //   addProductToCart(
  //     data?.storeDoc,
  //     {
  //       ...data?.product,
  //     },
  //     city,
  //     country
  //   );
  // };

  useEffect(() => {
    const fixedComponentConstructor = [
      () => (
        <Container
          sx={(theme) => ({
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            margin: " 4px auto ",
            borderRadius: "6px",
            height: "46px",
            border: `1px solid ${theme.primaryColor}`,
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
          })}>
          <Group spacing={5}>
            <ActionIcon
              size={"md"}
              variant="default"
              onClick={() => handlers.current.decrement()}>
              –
            </ActionIcon>

            <NumberInput
              size={"xs"}
              sx={{
                maxWidth: "70px",

                width: "auto"
              }}
              hideControls
              precision={calculatePrecision(product?.measurementSystem)}
              value={qty}
              onChange={(val) => setQty(val !== undefined ? val : 0)}
              handlersRef={handlers}
              min={0}
              step={calculateStep(product?.measurementSystem)}
              styles={{ input: { textAlign: "center" } }}
              parser={(value) => value.replace(/[$,\s]/g, "")}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `${t(product?.measurementSystem)} ${value}`.replace(
                      /(\d)(?=(\d{3})+(?!\d))/g,
                      "$1,"
                    )
                  : `${t(product?.measurementSystem)} `
              }
            />

            <ActionIcon
              size={"md"}
              variant="default"
              onClick={() => handlers.current.increment()}>
              +
            </ActionIcon>
          </Group>
          <Box>
            <Button
              compact
              onClick={() => {
                addProductWithNoOptionsToCart(
                  storeDoc,
                  { ...product, qty, key: randomId() },
                  setCartInfo,
                  // city,
                  // country,
                  orderType
                );
              }}>
              {t("Set In Cart")}
            </Button>
          </Box>
        </Container>
      )
    ];
    if (data && !isLoading && isFetched) {
      setFixedComponent(fixedComponentConstructor);
    }
  }, [
    data,
    isLoading,
    isFetched,
    qty,
    setQty,
    setFixedComponent,
    addProductWithNoOptionsToCart,
    storeDoc,
    product
    // city,
    // country
  ]);

  if (isError) {
    return <Text>{error as any}</Text>;
  }
  if (isLoading) {
    return <Loader />;
  }

  return (
    product && (
      <Container
        sx={{
          marginBottom: "56px"
        }}>
        <Stack>
          <Breadcrumbs>
            {crumbs({ items: productCrumbsArray({ params, crumbsMaker }) })}
          </Breadcrumbs>
          <Box>
            <Carousel>
              {product.images.map((image) => {
                return (
                  <Carousel.Slide>
                    <ImageModal
                      sx={(theme) => ({
                        maxWidth: 500,
                        borderRadius: "6px",
                        maxHeight: 500,
                        [theme.fn.largerThan("sm")]: {
                          maxWidth: 300,
                          maxHeight: 300
                        }
                      })}
                      ImageComponent={
                        <AspectRatio
                          ratio={500 / 500}
                          sx={(theme) => ({
                            maxWidth: 500,
                            borderRadius: "6px",
                            maxHeight: 500,
                            [theme.fn.largerThan("sm")]: {
                              maxWidth: 300,
                              maxHeight: 300
                            }
                          })}
                          mx="auto">
                          <Image
                            radius={6}
                            sx={{
                              width: "100%",

                              height: "100px"
                            }}
                            imageName={
                              product?.images?.length > 0
                                ? image
                                : "c72e349a9bc184cbdcfb1386060d4b5b"
                            }
                          />
                        </AspectRatio>
                      }
                      src={`${url}preview/${image}`}
                    />
                  </Carousel.Slide>
                );
              })}
            </Carousel>

            {/* <Container> */}
            <Text
              sx={{
                fontSize: "28px"
              }}>
              {product.title}
            </Text>
            <Group spacing={3}>
              <Text>{storeDoc?.currency || "LYD"}</Text>
              <Text
                sx={(theme) => ({
                  fontSize: "24px",
                  fontWeight: "bold"
                })}>
                {` ${product.price - product.price * storeServiceFee} `}
              </Text>
              <Text>{t("Per")}</Text>
              <Text>{t(product?.measurementSystem)}</Text>
            </Group>
            {/* </Container> */}
            <Space h={12} />
          </Box>

          <Divider
            labelPosition="center"
            label={
              <Text weight={700} size={16}>
                {t("Description")}
              </Text>
            }
          />

          <Box
            sx={{
              width: "100%",
              // overflowX: "auto",
              display: "flex",
              flexWrap: "wrap",
              whiteSpace: "normal"
            }}>
            <HtmlRenderer htmlString={product.description} />
            {/* <Text>{product.description}</Text> */}
          </Box>
        </Stack>
      </Container>
    )
  );
};

export default ProductWithoutOptions;
