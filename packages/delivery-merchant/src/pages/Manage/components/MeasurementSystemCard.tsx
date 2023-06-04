import {
  Box,
  Card,
  CardSection,
  Paper,
  Select,
  Skeleton,
  Text,
} from "@mantine/core";
import { t } from "utils/i18nextFix";
import React from "react";
import { ProductsCard } from "../types";

interface MeasurementSystemCardProps extends ProductsCard {}

const MeasurementSystemCard: React.FC<MeasurementSystemCardProps> = ({
  onChangeHandler,
  productInfo,
  isLoading,
}) => {
  return (
    <Paper shadow={"sm"} p={"md"} sx={{ margin: "auto", marginBlock: 10 }}>
      {/* <CardSection
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '18px 32px',
          justifyContent: 'space-between',
        }}
      > */}

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text>{t("Mesurement System")}</Text>
          <Skeleton height={30} />
        </Box>
      ) : (
        <Select
          label={t("Mesurement System")}
          required
          data={[
            { label: t("Kilo"), value: "Kilo" },
            { label: t("Liter"), value: "Liter" },
            // { label: t("Gram"), value: "Gram" },
            // { label: t("Milliliter"), value: "Milliliter" },
            { label: t("Unit"), value: "Unit" },
          ]}
          value={productInfo.measurementSystem}
          onChange={(e) => {
            onChangeHandler(e, "measurementSystem");
          }}
        />
      )}

      {/* </CardSection> */}
    </Paper>
  );
};

export default MeasurementSystemCard;
