import React, { useEffect, useState } from "react";

import InfoCard from "./InfoCard";

import ShippingCard from "./ShippingCard";
import { ProductInfo, ProductsCard } from "../types";
import { Box, Button, Container, Grid } from "@mantine/core";

import MediaCard from "./MediaCard";
import MeasurementSystemCard from "./MeasurementSystemCard";
import { useParams } from "react-router";

import { t } from "utils/i18nextFix";
// import { Helmet } from "react-helmet-async";

import Barcode from "./Barcode";
import BrandCard from "./BrandCard";
import { useGetBrandsForList } from "pages/Brands/Hooks/useGetBrandsForList";
import { useGetProduct } from "../hooks/useGetProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
interface UpdateProductProps {}

const UpdateProduct: React.FC<UpdateProductProps> = () => {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    textInfo: {
      title: "",
      description: "",
    },
    measurementSystem: "Unit",

    weightInKilo: "",
    barcode: "",
    tags: [],

    images: [],
    files: [],
    brand: "",
  });

  const { productId } = useParams<{ productId: string }>();

  const { data, isFetched, isLoading } = useGetProduct(productId);
  const { data: brands = [], isLoading: isBrandListLoading } =
    useGetBrandsForList();

  const { mutate } = useUpdateProduct();

  useEffect(() => {
    if (data && !isLoading && isFetched) {
      setProductInfo(data);
    }
  }, [isFetched]);

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

        mutate({ productId: productId, product: productInfo });
        // localStorage.removeItem("productInfo");
      }}
    >
      {/* <Helmet>
        <title>{t(isLoading ? "Loading" : productInfo?.textInfo?.title)}</title>
      </Helmet> */}
      <Box m={2} mt={8}>
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
              isLoading={isLoading}
            />
            <MediaCard
              currentImages={productInfo.images}
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
              isLoading={isLoading}
            />

            <MeasurementSystemCard
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
              isLoading={isLoading}
            />

            <ShippingCard
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
              isLoading={isLoading}
            />
          </Grid.Col>
          <Grid.Col xs={2} sm={4} md={4} lg={4}>
            <Barcode
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
              isLoading={isLoading}
            />
            <BrandCard
              onChangeHandler={onChangeHandler}
              productInfo={productInfo}
              isLoading={isBrandListLoading}
              brands={isBrandListLoading ? [] : brands}
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
            m={"0px auto"}
            fullWidth
            sx={{
              maxWidth: "450px",
            }}
            type="submit"
          >
            {t("Update")}
          </Button>
        </Container>
      </Box>
    </form>
  );
};

export default UpdateProduct;
