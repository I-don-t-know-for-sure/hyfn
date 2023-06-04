import { Button, Center, Chip, Container, Stack, Text } from "@mantine/core";

import { useCart } from "../../contexts/cartContext/Provider";

import { t } from "../../util/i18nextFix";
import React, { useState } from "react";

import { Link } from "react-router-dom";

import InCartStore from "./components/InCartStore";

import { convertObjectToArray } from "../../pages/CheckOut/utils/convertObjectToArray";
import { calculateOrderCost } from "../../util/calculateOrderCost";

interface CartProps {}

const Cart: React.FC<CartProps> = ({}) => {
  const { cart, changeOrderType, clearCart, setCartInfo } = useCart();
  const cartArray = convertObjectToArray(cart);
  const orderCost = calculateOrderCost(cartArray);
  console.log("🚀 ~ file: Cart.tsx:21 ~ orderCost", orderCost);

  return (
    <Container>
      {Object.keys(cart).map((storeId) => {
        const store = cart[storeId];
        return <InCartStore inCartStore={store} />;
      })}
      <Container>
        {Object.keys(cart).length === 0 ? (
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Text
              sx={{
                fontSize: "24px",
              }}
              weight={600}
            >
              {t("your cart is empty! ... go fill it up")}
            </Text>
            <Button component={Link} to={"/home"}>
              {t("Home")}
            </Button>
          </Container>
        ) : (
          <Stack>
            {/* {orderCost < 50 ? (
              <Button
                disabled={orderCost < 50}
                style={{
                  width: '100%',
                }}
              >
                {t('Place Order')}
              </Button>
            ) : (
              <Button
                component={Link}
                to={'/checkout'}
                style={{
                  width: '100%',
                }}
              >
                {t('Place Order')}
              </Button>
            )} */}
            <Button onClick={() => clearCart(setCartInfo)}>
              {t("Clear cart")}
            </Button>
            <Center>
              <Text>{t("Order total must exceed 50")}</Text>
            </Center>
          </Stack>
        )}
      </Container>
    </Container>
  );
};

export default Cart;
