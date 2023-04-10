import {
  ActionIcon,
  AspectRatio,
  Box,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import Image from "../../../components/Image";
import ProductControler from "../../../components/ProductControler";
import { storeServiceFee } from "../../../config/constents";
import React, { useEffect, useState } from "react";

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
  options: { hasOptions: boolean };
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
  storefront: string;
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
  city,
  country,
  storefront,
  addedProducts,
  // likeMutation,
}) => {
  const initialLikeValue = product.customerLikesProduct;
  const [likeProduct, setLikeProduct] = useState(initialLikeValue);
  const theme = useMantineTheme();
  const [addedLike, setAddedLike] = useState(0);

  useEffect(() => {
    // setAddedLike(
    //   product.customerLikesProduct === true
    //     ? product.likes - 1
    //     : product.likes + 1
    // );
  }, [likeProduct]);

  return (
    <Box
      sx={{
        width: "320px",
        margin: "auto",
        height: "400px",
        position: "relative",
      }}
    >
      {!product?.options?.hasOptions && (
        <Box
          sx={{
            zIndex: 999,
            position: "absolute",
            top: 20,
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
              productId: product._id.toString(),
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
          textDecoration: "none",
        }}
      >
        <Box m={12} style={{}}>
          <Image radius={6} imageName={product.images[0]} />

          <Box>
            <Text>
              ${product.pricing.price - product.pricing.price * storeServiceFee}
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
