import {
  Box,
  Card,
  CardSection,
  Divider,
  Grid,
  Group,
  Paper,
  Select,
  Skeleton,
  Text,
  TextInput,
} from "@mantine/core";
import { t } from "utils/i18nextFix";
import React from "react";
import { ProductInfo, ProductsCard } from "../types";

interface AppProps {
  onChangeHandler: (
    value: any,
    firstChangedKey: string,
    chengedKey: string
  ) => void;
  productInfo: ProductInfo;
}

const PricingCard: React.FC<ProductsCard> = ({
  onChangeHandler,
  productInfo,
  isLoading,
}) => {
  return (
    <Paper shadow={"sm"} p={"md"}>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: "18px 32px",
            justifyContent: "space-between",
          }}
        >
          <Group
            grow
            position="center"
            sx={{
              width: "100%",
            }}
          >
            <Box>
              <Text>{t("Pricing")}</Text>
              <Skeleton height={30} />
            </Box>
            <Box>
              <Text>{t("Currency")}</Text>
              <Skeleton height={30} />
            </Box>
          </Group>
        </Box>
      ) : (
        <>
          <Grid grow>
            <Grid.Col span={6}>
              <TextInput
                sx={{
                  maxWidth: "100%",
                }}
                type="number"
                label={t("Pricing")}
                required
                placeholder={t(
                  `${productInfo.currency} 10.00 Per ${productInfo.measurementSystem}`
                )}
                value={`${productInfo?.price || ""}`}
                onChange={(e) => {
                  onChangeHandler(e.target.value, "price");
                }}
                rightSectionWidth={120}
                rightSection={
                  <Group
                    position="right"
                    sx={{
                      width: "100%",
                    }}
                    spacing={5}
                  >
                    <Text weight={120}>{t("Per")}</Text>

                    <Select
                      variant="unstyled"
                      sx={{
                        maxWidth: "65%",
                      }}
                      // label={t("Mesurement System")}
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
                  </Group>
                }
              />
            </Grid.Col>
            {/* <Grid.Col span={"auto"}>
              <Select
                style={{
                  width: "80px",
                  maxWidth: "140px",
                }}
                required
                label={t("Currency")}
                data={[
                  { label: "LYD", value: "LYD" },
                  // { label: 'USD', value: 'USD' },
                ]}
                value={productInfo.currency}
                // onChange={(e) => {
                //   onChangeHandler(e, "pricing", "currency");
                // }}
              />
            </Grid.Col> */}
          </Grid>
        </>
      )}

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: "18px 32px",
            justifyContent: "space-between",
          }}
        >
          <Group
            grow
            position="center"
            sx={{
              width: "100%",
            }}
          >
            <Box>
              <Text>{t("Compare at Price")}</Text>
              <Skeleton height={30} />
            </Box>
            <Box>
              <Text>{t("Cost Per Item")}</Text>
              <Skeleton height={30} />
            </Box>
          </Group>
        </Box>
      ) : (
        <>
          <Group
            grow
            position="center"
            sx={{
              width: "100%",
            }}
          >
            <TextInput
              type="number"
              required
              label={t("Compare at Price")}
              placeholder={`${productInfo.currency} 20.00 Per ${productInfo.measurementSystem}`}
              value={`${productInfo?.prevPrice || ""}`}
              onChange={(e) => {
                onChangeHandler(e.target.value, "prevPrice");
              }}
            />
            {/* <TextInput
              type="number"
              required
              label={t('Cost Per Item')}
              placeholder={`${productInfo.pricing.currency} 6.00 Per ${productInfo.measurementSystem}`}
              value={`${productInfo?.pricing?.costPerItem || ''}`}
              onChange={(e) => {
                onChangeHandler(e.target.value, 'pricing', 'costPerItem')
              }}
            /> */}
          </Group>
        </>
      )}
    </Paper>
  );
};

export default PricingCard;
