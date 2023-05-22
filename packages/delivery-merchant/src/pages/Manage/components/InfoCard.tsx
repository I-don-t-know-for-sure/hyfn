import {
  ActionIcon,
  Box,
  Button,
  Card,
  CardSection,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { t } from "utils/i18nextFix";
import React, { useEffect, useState } from "react";
import { ProductInfo, ProductsCard } from "../types";
import FullTextEditor from "../../../components/FullTextEditor";
import { log } from "console";
import GenerateDescriptionModal from "./GenerateDescriptionModal";

const InfoCard: React.FC<ProductsCard> = ({
  onChangeHandler,
  productInfo,
  isLoading,
  productId,
}) => {
  const [value, setValue] = useState("");
  const [generatedDescription, setGenerateDescription] = useState("");
  console.log("🚀 ~ file: InfoCard.tsx:23 ~ value:", value);
  console.log("🚀 ~ file: InfoCard.tsx:23 ~ value:", productInfo.description);
  useEffect(() => {
    console.log(
      "🚀 ~ file: InfoCard.tsx:23 ~ description:",
      productInfo,
      isLoading,
      value
    );

    if (!isLoading) {
      if (value === "") {
        setValue(productInfo.description);
      }
    }
  }, [isLoading, productInfo.description]);
  // const [value, setValue] = useState("");

  useEffect(() => {
    if (productInfo.description !== value) {
      onChangeHandler(value, "description");
    }
  }, [value]);

  return (
    <Paper shadow={"sm"} p={"md"}>
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
        <Stack>
          <TextInput
            required
            label={t("Title")}
            value={productInfo.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeHandler(e.target.value, "title")
            }
          />

          {/* {!isLoading &&
            productInfo?.textInfo?.description &&
            (() => {
              console.log(
                "🚀 ~ file: InfoCard.tsx:81bxdhchdbchdbh ~ value:",
                productInfo.textInfo.description
              );

              return (
                <FullTextEditor
                  setValue={setValue}
                  value={productInfo.textInfo.description}
                />
              );
            })()} */}
          {!isLoading && (
            <Stack>
              <Group position="apart">
                <Text weight={700}>{t("Description")}</Text>{" "}
                {productId && (
                  <GenerateDescriptionModal
                    productId={productId}
                    onDescriptionChangeHandler={(newDescription: string) => {
                      // setGenerateDescription(newDescription);
                      // onChangeHandler(newDescription, "textInfo", "description");
                    }}
                  />
                )}
              </Group>

              <FullTextEditor
                setValue={setValue}
                value={productInfo.description}
                // newContent={generatedDescription}
              />
            </Stack>
          )}
          {/* <TextInput
            label={t("Description")}
            required
            value={productInfo.textInfo?.description || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeHandler(e.target.value, "textInfo", "description")
            }
          /> */}
          {/* <RichTextEditor
            value={productInfo.textInfo?.description || ""}
            onChange={setValue}
          /> */}
        </Stack>
      )}
    </Paper>
  );
};

export default InfoCard;
