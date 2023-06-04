import {
  Card,
  CardSection,
  Checkbox,
  Container,
  Loader,
  TextInput,
} from "@mantine/core";
import { t } from "utils/i18nextFix";
import React from "react";
import { ProductsCard } from "../types";

interface ShippingCardProps extends ProductsCard {}

const ShippingCard: React.FC<ShippingCardProps> = ({
  onChangeHandler,
  productInfo,
  isLoading,
}) => {
  return (
    <Card shadow={"sm"} p={"md"} sx={{ margin: "auto", marginBlock: 10 }}>
      {isLoading ? (
        <Container>
          <Loader />
        </Container>
      ) : (
        <CardSection
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "18px 32px",
          }}
        >
          <TextInput
            required
            label={t("weight in Kilos")}
            type="number"
            value={productInfo?.weightInKilo || ""}
            onChange={(e) => {
              const weight = e.currentTarget.value;
              onChangeHandler(weight, "weightInKilo");
            }}
          />
        </CardSection>
      )}
    </Card>
  );
};

export default ShippingCard;
