import {
  ActionIcon,
  AspectRatio,
  Box,
  Group,
  Text,
  UnstyledButton,
  useMantineTheme
} from "@mantine/core";
import Image from "../../../components/Image";
import ProductControler from "../../../components/ProductControler";
import { storeServiceFee } from "hyfn-types";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { t } from "util/i18nextFix";

interface ProductType {
  id: any;

  title: string;
  description: string;

  price: number;
  currency: string;

  hasOptions: boolean;
  images: string[];

  measurementSystem: string;
}

interface ProductProps {
  addProduct: () => void;
  reduceOrRemoveProduct: () => void;
  productUrl: string;
  product: any;

  addedProducts: any[];
  // likeMutation: UseMutateFunction<
  //   any,
  //   unknown,
  //   {
  //     storeId: string;
  //     productId: string;
  //     city: string;
  //     country: string;
  //   },
  //   unknown
  // >;
}

const Product: React.FC<ProductProps> = ({
  addProduct,
  reduceOrRemoveProduct,
  productUrl,
  product,

  addedProducts
  // likeMutation,
}) => {
  return (
    <Box
      sx={{
        width: "320px",
        margin: "auto",
        height: "400px",
        position: "relative"
      }}>
      {!product?.hasOptions && (
        <Box
          sx={{
            zIndex: 999,
            position: "absolute",
            top: 20,
            right: 30
          }}>
          <ProductControler
            addproduct={addProduct}
            reduceOrRemoveProduct={reduceOrRemoveProduct}
            qty={addedProducts ? addedProducts[product?.id]?.qty : 0}
          />
        </Box>
      )}
      {/* <Box
        sx={{
          zIndex: 999,
          position: 'absolute',
          bottom: 30,
          right: 30,
        }}
      >
        <ActionIcon
          sx={{
            width: 'fit-content',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => {
            setLikeProduct(!likeProduct);
            setAddedLike(likeProduct === true ? product.likes : product.likes > 0 ? product.likes + 1 : 1);
            likeMutation({
              city,
              country,
              productId: product.id,
              storeId: storefront,
            });
          }}
        >
          <Text m={'4px 4px 0px 0px'}>{addedLike === 0 ? product.likes : addedLike}</Text>
          {likeProduct ? (
            <HiThumbUp color={theme.colorScheme === 'dark' ? theme.white : theme.black} size={32} />
          ) : (
            <HiOutlineThumbUp size={32} />
          )}
        </ActionIcon>
      </Box> */}
      <UnstyledButton
        component={Link}
        to={productUrl}
        style={{
          textDecoration: "none"
        }}>
        <Box m={12} style={{}}>
          <Image radius={6} imageName={product.images[0]} />

          <Box>
            <Text weight={700}>{product.title}</Text>
          </Box>
          <Box>
            <Group spacing={3}>
              <Text>{product?.currency || "LYD"}</Text>
              <Text
                sx={(theme) => ({
                  fontSize: "24px",
                  color: theme.primaryColor
                })}>
                {` ${product.price - product.price * storeServiceFee} `}
              </Text>
              <Text>{t("Per")}</Text>
              <Text color="red">{t(product?.measurementSystem)}</Text>
            </Group>
            {/* <Text>
              ${product.pricing.price - product.pricing.price * storeServiceFee}
            </Text> */}
          </Box>
        </Box>
      </UnstyledButton>
    </Box>
  );
};

export default Product;
