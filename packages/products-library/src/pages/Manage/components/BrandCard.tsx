import {
  Box,
  Button,
  Card,
  Select,
  Skeleton,
  Text,
  TextInput,
} from "@mantine/core";
import BrandModal from "components/BrandModal";
import { t } from 'utils/i18nextFix';
import { useGetBrands } from "pages/Brands/Hooks/useGetBrands";
import React from "react";
import { ProductsCard } from "../types";

interface BrandCardProps extends ProductsCard {
  brands: any[];
}

const BrandCard: React.FC<BrandCardProps> = ({
  onChangeHandler,
  isLoading,
  productInfo,
  brands,
}) => {
  return (
    <Card shadow={"sm"} p={"md"} sx={{ margin: "auto", marginBlock: 10 }}>
      {!isLoading ? (
        <Select
          searchable
          label={t("Producing company / brand ")}
          data={Array.isArray(brands) ? brands : []}
          value={productInfo.brand}
          onChange={(e) => {
            onChangeHandler(e, "brand");
          }}
        />
      ) : (
        <Box>
          <Text>{t("Brand")}</Text>
          <Skeleton height={30} />
        </Box>
      )}
    </Card>
  );
};

export default BrandCard;
