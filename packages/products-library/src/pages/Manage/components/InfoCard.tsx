import {
  Box,
  Card,
  CardSection,
  Skeleton,
  Text,
  TextInput,
} from "@mantine/core";
import { t } from 'utils/i18nextFix';
import React, { useEffect, useState } from "react";
import { ProductInfo, ProductsCard } from "../types";
import { RichTextEditor } from "@mantine/rte";

const InfoCard: React.FC<ProductsCard> = ({
  onChangeHandler,
  productInfo,
  isLoading,
}) => {
  // const [value, setValue] = useState("");

  // useEffect(() => {
  //   if (productInfo.textInfo?.description !== value) {
  //     onChangeHandler(value, "textInfo", "description");
  //   }
  // }, [value]);
  return (
    <Card shadow={"sm"} p={"md"} sx={{ margin: "auto" }}>
      {isLoading ? (
        <>
          <Box>
            <Text>{t("Title")}</Text>
            <Skeleton height={30} />
          </Box>
          <Box>
            <Text>{t("Description")}</Text>
            <Skeleton height={30} />
          </Box>
        </>
      ) : (
        <CardSection m={"sm"}>
          <TextInput
            required
            label={t("Title")}
            value={productInfo.textInfo?.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeHandler(e.target.value, "textInfo", "title")
            }
          />
          <TextInput
            label={t("Description")}
            required
            value={productInfo.textInfo?.description || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeHandler(e.target.value, "textInfo", "description")
            }
          />
          {/* <RichTextEditor
            value={productInfo.textInfo?.description || ""}
            onChange={setValue}
          /> */}
        </CardSection>
      )}
    </Card>
  );
};

export default InfoCard;
