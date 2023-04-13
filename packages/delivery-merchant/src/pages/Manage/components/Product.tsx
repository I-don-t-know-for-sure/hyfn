import React, { useEffect, useState } from "react";
import CollectionCard from "./CollectionCard";
import InfoCard from "./InfoCard";

import OptionsCard from "./OptionsCard";
import PricingCard from "./PricingCard";
import ShippingCard from "./ShippingCard";
import { ProductInfo, ProductsCard } from "../types";
import { Box, Button, Center, Container, Divider, Grid } from "@mantine/core";

import MediaCard from "./MediaCard";
import MeasurementSystemCard from "./MeasurementSystemCard";
import { useNavigate } from "react-router";
import { t } from "utils/i18nextFix";
// import { Helmet } from 'react-helmet-async'

import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUser } from "contexts/userContext/User";
import { currencies } from "config/constants";

interface ProductProps {}
/*
needs refactoring
*/
const Product: React.FC<ProductProps> = () => {
  const { userDocument } = useUser();
  const currency = currencies[userDocument.storeDoc.country];
  console.log("🚀 ~ file: Product.tsx:28 ~ currency", currency);
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    textInfo: {
      title: "",
      description: "",
    },
    measurementSystem: "Unit",
    pricing: {
      price: "",
      currency: currency,

      prevPrice: "",
      costPerItem: "",
    },

    weightInKilo: "",
    options: {
      hasOptions: false,

      options: [],
    },
    barcode: "",
    isActive: false,
    tags: [],
    collections: [],
    images: [],
    files: [],
    deletedImages: [],
    removeBackgroundImages: [],
  });

  const { mutate, data } = useCreateProduct();

  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      navigate(`/products/${data}`, { replace: true });
    }
  }, [data, navigate]);

  const onChangeHandler: ProductsCard["onChangeHandler"] = (
    value: any,
    firstChangedKey: string,
    changedKey?: string
  ) => {
    setProductInfo((prevState: any) => {
      if (changedKey === undefined) {
        return {
          ...prevState,
          [`${firstChangedKey}`]: value,
        };
      }

      return {
        ...prevState,
        [`${firstChangedKey}`]: {
          ...prevState[`${firstChangedKey}`],
          [`${changedKey}`]: value,
        },
      };
    });
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        //         const polishedOptions = productInfo.options.options.map((option) => {
        // option.optionValues.filter((value) => value !== false)
        //         })
        mutate(productInfo);
        /**
 *   xs: 370,
            sm: 576,
            md: 870,
            lg: 990,
            xl: 1200,
 */
        // localStorage.removeItem("productInfo");
      }}
    >
      {/* <Helmet>
        <title>{t('New Product')}</title>
      </Helmet> */}
      <Container m={2} mt={8}>
        <Grid
          grow
          sx={{
            width: "100%",
            margin: "auto",
          }}
        >
          <Grid.Col xs={9} sm={7} md={8} lg={8}>
            <InfoCard
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
            />
            <MediaCard
              currentImages={productInfo.images}
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
            />
            <MeasurementSystemCard
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
            />
            <PricingCard
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
            />

            <ShippingCard
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
            />
            <OptionsCard
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
              setProductInfo={setProductInfo}
            />
          </Grid.Col>
          <Grid.Col xs={2} sm={4} md={4} lg={4}>
            <CollectionCard
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
            />
          </Grid.Col>
        </Grid>

        <Container
          sx={{
            display: "flex",

            margin: "40px 24px",
          }}
        >
          <Button
            fullWidth
            sx={{
              maxWidth: "450px",
            }}
            m={"0px auto"}
            type="submit"
          >
            {t("Create")}
          </Button>
        </Container>
      </Container>
    </form>
  );
};

export default Product;
