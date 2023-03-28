import {
  ActionIcon,
  AspectRatio,
  Box,
  Button,
  Container,
  Group,
  Loader,
  NumberInput,
  NumberInputHandlers,
  Space,
  Text,
} from "@mantine/core";
import { useCart } from "../../contexts/cartContext/Provider";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

import Image from "../../components/Image";
import { useFixedComponent } from "../../contexts/fixedComponentContext/FixedComponentProvider";

import { randomId } from "@mantine/hooks";
import { t } from "../../util/i18nextFix";
import { useGetProduct } from "./hooks/useGetProduct";
import { storeServiceFee } from "../../config/constents";
import { ImageModal } from "hyfn-client";
import { useImage } from "contexts/imageContext/ImageProvider";

interface ProductWithoutOptionsProps {}

const ProductWithoutOptions: React.FC<ProductWithoutOptionsProps> = ({}) => {
  const { url, screenSizes } = useImage();

  const { storefront, country, city, productId } = useParams<{
    storefront: string;
    country: string;
    city: string;
    productId: string;
  }>();
  // const { state } = useLocation();
  // const { orderType } = state as { orderType: string };
  const [product, setProduct] = useState<any>();
  const [storeDoc, setStore] = useState<any>();

  const {
    data = {},
    isLoading,
    isFetched,
    isError,
    error,
  } = useGetProduct({ storefront, city, country, productId }, true);

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

  const calculatePrecision = (measurementSystem: string) => {
    if (measurementSystem === "Kilo" || measurementSystem === "Liter") {
      return 2;
    }
    if (measurementSystem === "Unit") {
      return 0;
    }
  };
  const calculateStep = (measurementSystem: string) => {
    if (measurementSystem === "Kilo" || measurementSystem === "Liter") {
      return 0.25;
    }
    if (measurementSystem === "Unit") {
      return 1;
    }
  };

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
              theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          })}
        >
          {/* <Box
            sx={{
              display: 'flex',
              width: '200px',
              margin: '0px auto',
              justifyContent: 'space-between',
            }}
          >
            <ActionIcon variant="outline" sx={{}}>
              <AiOutlineMinus onClick={decreaseQTY} />
            </ActionIcon>
            <Text>{qty}</Text>
            <ActionIcon variant="outline">
              <AiOutlinePlus onClick={increaseQTY} />
            </ActionIcon>
          </Box> */}
          {/* <NumberInput
            value={qty}
            onChange={(e) => {
              setQty(e);
            }}
          /> */}
          <Group spacing={5}>
            <ActionIcon
              size={"md"}
              variant="default"
              onClick={() => handlers.current.decrement()}
            >
              –
            </ActionIcon>

            <NumberInput
              size={"xs"}
              sx={{
                maxWidth: "150px",
              }}
              hideControls
              precision={calculatePrecision(product?.measurementSystem)}
              value={qty}
              onChange={(val) => setQty(val !== undefined ? val : 0)}
              handlersRef={handlers}
              min={0}
              step={calculateStep(product?.measurementSystem)}
              styles={{ input: { textAlign: "center" } }}
              icon={<Text>{t(product?.measurementSystem)}</Text>}
            />

            <ActionIcon
              size={"md"}
              variant="default"
              onClick={() => handlers.current.increment()}
            >
              +
            </ActionIcon>
          </Group>
          <Box>
            <Button
              onClick={() => {
                addProductWithNoOptionsToCart(
                  storeDoc,
                  { ...product, qty, key: randomId() },
                  setCartInfo,
                  city,
                  country,
                  orderType
                );
              }}
            >
              {t("set in Cart")}
            </Button>
          </Box>
        </Container>
      ),
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
    product,
    city,
    country,
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
          marginBottom: "56px",
        }}
      >
        <Box>
          <ImageModal
            sx={(theme) => ({
              maxWidth: 500,
              borderRadius: "6px",
              maxHeight: 500,
              [theme.fn.largerThan("sm")]: {
                maxWidth: 300,
                maxHeight: 300,
              },
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
                    maxHeight: 300,
                  },
                })}
                mx="auto"
              >
                <Image
                  radius={6}
                  sx={{
                    width: "100%",

                    height: "100px",
                  }}
                  imageName={
                    product?.images?.length > 0
                      ? product.images[0]
                      : "c72e349a9bc184cbdcfb1386060d4b5b"
                  }
                />
              </AspectRatio>
            }
            src={`${url}${screenSizes[0]}/${product.images[0]}`}
          />
          {/* <AspectRatio
            ratio={500 / 500}
            sx={(theme) => ({
              maxWidth: 500,
              borderRadius: '6px',
              maxHeight: 500,
              [theme.fn.largerThan('sm')]: {
                maxWidth: 300,
                maxHeight: 300,
              },
            })}
            mx="auto"
          >
            <Image
              radius={6}
              sx={{
                width: '100%',

                height: '100px',
              }}
              imageName={product?.images?.length > 0 ? product.images[0] : 'c72e349a9bc184cbdcfb1386060d4b5b'}
            />
          </AspectRatio> */}
          <Container>
            <Text
              sx={{
                fontSize: "28px",
              }}
            >
              {product.textInfo.title}
            </Text>
            <Text>{product.textInfo.description}</Text>
            <Text
              sx={{
                fontSize: "24px",
              }}
            >
              {`${storeDoc?.currency || "LYD"} ${
                product.pricing.price - product.pricing.price * storeServiceFee
              }`}
            </Text>
          </Container>
          <Space h={12} />
        </Box>
      </Container>
    )
  );
};

export default ProductWithoutOptions;
