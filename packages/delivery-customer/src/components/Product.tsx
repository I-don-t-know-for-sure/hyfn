import { AspectRatio, Box, Text, UnstyledButton } from "@mantine/core";
import Image from "components/Image";
import ProductControler from "components/ProductControler";
import { storeServiceFee } from "config/constents";

import React from "react";

import { UseMutateFunction } from "react-query";
import { Link } from "react-router-dom";

interface ProductType {
  _id: any;
  textInfo: {
    title: string;
    description: string;
  };
  pricing: {
    price: number;
  };
  options: {
    hasOptions: boolean;
  };
  images: string[];
  customerLikesProduct: boolean;
  likes: number;
}

interface ProductProps {
  addProduct: () => void;
  reduceOrRemoveProduct: () => void;
  productUrl: string;
  product: ProductType;
  city: string;
  country: string;
  orderType: string;
  storefront: string;
  addedProducts: any;
  likeMutation?: UseMutateFunction<
    any,
    unknown,
    {
      storeId: string;
      productId: string;
      city: string;
      country: string;
    },
    unknown
  >;
  currency: string;
}

const Product: React.FC<ProductProps> = ({
  addProduct,
  reduceOrRemoveProduct,
  productUrl,
  product,

  orderType,

  addedProducts,

  currency,
}) => {
  return (
    <Box
      sx={{
        width: "100%",

        height: "100%",
        position: "relative",
      }}
    >
      {!product?.options?.hasOptions && (
        <Box
          sx={{
            zIndex: 999,
            position: "absolute",
            top: 10,
            right: 30,
          }}
        >
          <ProductControler
            addproduct={addProduct}
            reduceOrRemoveProduct={reduceOrRemoveProduct}
            qty={addedProducts ? addedProducts[product._id.toString()]?.qty : 0}
          />
        </Box>
      )}

      <UnstyledButton
        component={Link}
        to={productUrl}
        state={{ orderType: orderType }}
        style={{
          textDecoration: "none",
        }}
      >
        <Box m={12} style={{}}>
          <AspectRatio ratio={150 / 150} sx={{ maxWidth: 300 }} mx="auto">
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

          <Box>
            <Text>
              {currency}
              {(
                product.pricing.price -
                product.pricing.price * storeServiceFee
              ).toFixed(3)}
            </Text>
          </Box>
          <Box>
            <Text weight={700}>{product.textInfo.title}</Text>
            <Text>{product.textInfo.description}</Text>
          </Box>
        </Box>
      </UnstyledButton>
    </Box>
  );
};

export default Product;
