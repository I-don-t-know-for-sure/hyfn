import { Box, Card, Skeleton, Text, TextInput } from "@mantine/core";
import { t } from 'utils/i18nextFix';
import React from "react";
import { ProductsCard } from "../types";

interface BarcodeProps extends ProductsCard {}

const Barcode: React.FC<BarcodeProps> = ({
  onChangeHandler,
  isLoading,
  productInfo,
}) => {
  return (
    <Card shadow={"sm"} p={"md"} sx={{ margin: "auto" }}>
      {!isLoading ? (
        <TextInput
          label={t("Product barcode")}
          required
          value={productInfo.barcode}
          onChange={(e) => {
            onChangeHandler(e.target.value, "barcode");
          }}
        />
      ) : (
        <Box>
          <Text>{t("Product barcode")}</Text>
          <Skeleton height={30} />
        </Box>
      )}
    </Card>
  );
};

export default Barcode;
