import {
  Box,
  Button,
  Card,
  CardSection,
  Center,
  Chip,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import Image from "components/Image";
import InstructionsModal from "components/InstructionsModal";
import ProductControler from "components/ProductControler";
import {
  MINIMUM_AMOUNT_TO_CHECKOUT,
  ORDER_TYPE_DELIVERY,
  ORDER_TYPE_PICKUP,
  storeServiceFee,
} from "config/constents";
import { useCart } from "contexts/cartContext/Provider";
import { t } from "util/i18nextFix";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { add, multiply, subtract } from "mathjs";

interface InCartStoreProps {
  inCartStore: any;
}

const InCartStore: React.FC<InCartStoreProps> = ({ inCartStore }) => {
  console.log("🚀 ~ file: InCartStore.tsx:29 ~ inCartStore:", inCartStore);
  const {
    setCartInfo,
    removeFromCart,
    addProductToCart,
    reduceOrRemoveProductFromCart,
    updateInstructions,
    changeStoreOrderType,
  } = useCart();

  const storeTotal = Object.keys(inCartStore.addedProducts)?.reduce(
    (acc, productId) => {
      const product = inCartStore.addedProducts[productId];
      if (Array.isArray(product)) {
        const priceAfterFee = product.reduce((acc, product) => {
          const productOptionsPrice = calculateProductValuesPrice(product);
          console.log(
            "🚀 ~ file: InCartStore.tsx:48 ~ productOptionsPrice ~ productOptionsPrice",
            productOptionsPrice
          );
          const priceAfterFee = add(
            product?.pricing?.price,
            subtract(
              productOptionsPrice,
              multiply(
                add(product?.pricing?.price, productOptionsPrice),
                storeServiceFee
              )
            )
          );
          // const priceAfterFee =
          //   product?.pricing?.price +
          //   productOptionsPrice -
          //   (product?.pricing?.price + productOptionsPrice) * storeServiceFee;
          return add(acc, multiply(priceAfterFee, product?.qty));
        }, 0);
        return add(acc, priceAfterFee);
      }
      const priceAfterFee = subtract(
        product?.pricing?.price,
        multiply(product.pricing.price, storeServiceFee)
      );
      return add(acc, multiply(priceAfterFee, product?.qty));
    },
    0
  );
  //const addedProducts = cart[inCartStore?._id.toString()].addedProducts;
  return (
    <Card shadow={"md"} m={"6px auto"}>
      <Center
        sx={{
          width: "100%",
          height: "40px",
        }}
      >
        {/* <Group grow sx={{ width: '100%' }}> */}
        <Chip
          size="lg"
          sx={
            {
              // width: '100%',
            }
          }
          checked={inCartStore.orderType === ORDER_TYPE_DELIVERY}
          onChange={(e) => {
            changeStoreOrderType({
              orderType: ORDER_TYPE_DELIVERY,
              setCartInfo,
              storeId: inCartStore._id,
            });
            // setOrderType('Delivery');
          }}
          mr={2}
        >
          {t("Delivery")}
        </Chip>
        <Chip
          size="lg"
          ml={2}
          onChange={(e) => {
            changeStoreOrderType({
              orderType: ORDER_TYPE_PICKUP,
              setCartInfo,
              storeId: inCartStore._id,
            });
            // setOrderType('Pickup');
          }}
          checked={inCartStore.orderType === ORDER_TYPE_PICKUP}
        >
          {t("Pickup")}
        </Chip>
        {/* </Group> */}
      </Center>
      <CardSection
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "6px 6px ",
          borderBottom: "1px solid ",
          minHeight: "60px",
          maxHeight: "120px",
        }}
      >
        <UnstyledButton
          component={Link}
          to={`/${inCartStore?._id?.toString()}/${inCartStore?.country}/${
            inCartStore?.city
          }`}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Group>
            <Image
              width={44}
              radius={6}
              imageName={inCartStore.image[0]}
              alt={inCartStore.storeName}
            />{" "}
            <Text>{inCartStore.storeName}</Text>
          </Group>
        </UnstyledButton>
        {/* <Box
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>{inCartStore.storeName}</Text>
        </Box> */}
        <Box>{` ${inCartStore?.currency || "LYD"} ${storeTotal.toFixed(
          2
        )}`}</Box>
      </CardSection>
      <CardSection>
        {Object.keys(inCartStore.addedProducts)?.map((productId) => {
          const product = inCartStore.addedProducts[productId];
          const addProduct = () => {
            addProductToCart(inCartStore, product, setCartInfo);
          };
          const reduceOrRemoveProduct = () => {
            reduceOrRemoveProductFromCart(inCartStore, product, setCartInfo);
          };
          const updateProductInstructions = (instructions: string) => {
            updateInstructions({
              storeId: inCartStore._id,
              productId: product._id,
              instructions,
              setCartInfo,
            });
          };
          const checkProduct = Array.isArray(product) ? product[0] : product;
          const productUrl =
            checkProduct?.options.length > 0
              ? `/product/${inCartStore._id}/${inCartStore.country}/${inCartStore.city}/${checkProduct._id}`
              : `/product/withnotoptions/${inCartStore._id}/${inCartStore.country}/${inCartStore.city}/${checkProduct._id}`;
          // const som = addedProducts?.find((added) => {
          //   return added._id === product._id.toString();
          // })?.qty;
          if (Array.isArray(product)) {
            return product.map((product) => {
              const productOptionsPrice = calculateProductValuesPrice(product);
              return (
                <Container
                  key={productId}
                  style={{
                    margin: "12px auto",
                  }}
                >
                  <UnstyledButton
                    component={Link}
                    to={productUrl}
                    style={{
                      marginTop: "4px",

                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",

                      height: "54px",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "row",

                        width: "150px",
                      }}
                    >
                      <Box>
                        <Image
                          radius={6}
                          width={44}
                          height={44}
                          imageName={
                            product.images?.length > 0 ? product.images[0] : ""
                          }
                          alt={product.textInfo?.title}
                        />
                      </Box>
                      <Box
                        style={{
                          marginLeft: "6px",
                        }}
                      >
                        <Text>{product.textInfo?.title}</Text>
                        {/* <Text size="sm">{t('weight')}</Text> */}
                      </Box>
                    </Box>
                    {!Array.isArray(product?.options) && (
                      <Box>
                        <ProductControler
                          qty={product.qty}
                          addproduct={addProduct}
                          reduceOrRemoveProduct={reduceOrRemoveProduct}
                        />
                      </Box>
                    )}
                    <Box>
                      <Text>
                        {` ${inCartStore?.currency || "LYD"} ${multiply(
                          subtract(
                            add(product?.pricing?.price, productOptionsPrice),
                            multiply(
                              add(product?.pricing?.price, productOptionsPrice),
                              storeServiceFee
                            )
                          ),
                          product?.qty
                        ).toFixed(2)}`}
                      </Text>
                    </Box>
                  </UnstyledButton>
                  <Box>
                    <Button
                      style={{
                        marginRight: "8px",
                      }}
                      variant="subtle"
                      onClick={() => {
                        removeFromCart(inCartStore, product, setCartInfo);
                      }}
                    >
                      {t("Remove")}
                    </Button>

                    <InstructionsModal
                      updateProductInstructions={updateProductInstructions}
                      prevInstructions={product?.instructions}
                    />
                  </Box>
                </Container>
              );
            });
          }
          return (
            <Container
              key={productId}
              style={{
                margin: "12px auto",
              }}
            >
              <Box
                style={{
                  marginTop: "4px",

                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",

                  height: "54px",
                }}
              >
                <UnstyledButton
                  component={Link}
                  to={productUrl}
                  style={{
                    display: "flex",
                    flexDirection: "row",

                    width: "150px",
                  }}
                >
                  <Box>
                    <Image
                      radius={6}
                      width={44}
                      height={44}
                      imageName={
                        product.images?.length > 0 ? product.images[0] : ""
                      }
                      alt={product.textInfo?.title}
                    />
                  </Box>
                  <Box
                    style={{
                      marginLeft: "6px",
                    }}
                  >
                    <Text>{product.textInfo?.title}</Text>
                    {/* <Text size="sm">{t('weight')}</Text> */}
                  </Box>
                </UnstyledButton>

                <Box>
                  <ProductControler
                    qty={product.qty}
                    addproduct={addProduct}
                    reduceOrRemoveProduct={reduceOrRemoveProduct}
                  />
                </Box>

                <Group>
                  <Text>
                    {`${inCartStore?.currency || "LYD"} ${(
                      (product?.pricing?.price -
                        product.pricing.price * storeServiceFee) *
                      product?.qty
                    ).toFixed(2)} `}
                  </Text>
                </Group>
              </Box>
              <Box>
                <Button
                  style={{
                    marginRight: "8px",
                  }}
                  variant="subtle"
                  onClick={() => {
                    removeFromCart(inCartStore, product, setCartInfo);
                  }}
                >
                  {t("Remove")}
                </Button>

                <InstructionsModal
                  updateProductInstructions={updateProductInstructions}
                  prevInstructions={product?.instructions}
                />
              </Box>
            </Container>
          );
        })}
      </CardSection>
      <CardSection>
        <Container mb={12}>
          <Stack spacing={20}>
            {storeTotal < 50 ? (
              <Button
                disabled={storeTotal < 50}
                style={{
                  width: "100%",
                }}
              >
                <Text
                  sx={{
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {` ${t(
                    "Minmum to checkout is"
                  )} ${MINIMUM_AMOUNT_TO_CHECKOUT} ${
                    inCartStore?.currency || "LYD"
                  }`}
                </Text>
              </Button>
            ) : (
              <Button
                component={Link}
                to={"/checkout"}
                state={{
                  storeId: inCartStore._id,
                }}
                style={{
                  width: "100%",
                }}
              >
                {t("Place Order")}
              </Button>
            )}
          </Stack>
        </Container>
        {/* <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '6px auto',
          }}
        >
          {' '}
          <Chip
            checked={orderType === 'Delivery'}
            onChange={(e) => {
              changeOrderType(inCartStore, 'Delivery');
              setOrderType('Delivery');
            }}
            mr={2}
          >
            {t('Delivery')}
          </Chip>
          <Chip
            ml={2}
            onChange={(e) => {
              changeOrderType(inCartStore, 'Pickup');
              setOrderType('Pickup');
            }}
            checked={orderType === 'Pickup'}
          >
            {t('Pickup')}
          </Chip>
        </Box> */}
      </CardSection>
    </Card>
  );
};

export default InCartStore;
function calculateProductValuesPrice(product: any) {
  return product.options.reduce((accu, option) => {
    const optionValuesPrice = option.optionValues.reduce((valueAccu, value) => {
      return add(valueAccu, value.price);
    }, 0);
    return add(accu, optionValuesPrice);
  }, 0);
}
