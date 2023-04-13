import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Group,
  Image,
  Input,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { t } from "utils/i18nextFix";

import { ProductsCard } from "../types";
import { useState } from "react";

interface MediaCardProps extends ProductsCard {
  currentImages?: string[];
}
const MediaCard: React.FC<MediaCardProps> = ({
  onChangeHandler,
  productInfo,
  currentImages,
}) => {
  const { files } = productInfo;

  return (
    <Paper shadow={"sm"} p={"md"} sx={{ margin: "auto", marginBlock: 10 }}>
      <Title>{t("Product Images")}</Title>
      <Box>
        {files?.map((file, number) => {
          return (
            <Badge
              rightSection={
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => {
                    onChangeHandler(
                      files.filter((oldFiles, index) => number !== index),
                      "files"
                    );
                  }}
                >
                  X
                </Button>
              }
              key={file.name}
              size={"md"}
            >
              <Text>{file?.name}</Text>
            </Badge>
          );
        })}

        <Input
          type={"file"}
          multiple
          onChange={(event) => {
            const uploadedFiles =
              files?.length > 0
                ? [...files, ...event.target.files]
                : [...event.target.files];
            onChangeHandler(uploadedFiles, "files");
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {currentImages?.map((imageName, number) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                  margin: "4px",
                }}
              >
                <Image
                  mb={4}
                  radius={6}
                  width={70}
                  height={70}
                  src={`${
                    import.meta.env.VITE_APP_BUCKET_URL
                  }/tablet/${imageName}`}
                  alt={t("product image")}
                />
                <Group>
                  <ActionIcon
                    onClick={() => {
                      const newImages = currentImages.filter(
                        (image) => image !== imageName
                      );
                      if (productInfo?.deletedImages?.length > 0) {
                        const updatedDeletedImages = [
                          ...productInfo?.deletedImages,
                          imageName,
                        ];
                        onChangeHandler(updatedDeletedImages, "deletedImages");
                      } else {
                        onChangeHandler([imageName], "deletedImages");
                      }
                      onChangeHandler(newImages, "images");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="#2c3e50"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </ActionIcon>
                  <Checkbox
                    // onChange={(e) => {
                    //   setKeys((keys) => {
                    //     if (e.target.checked) {
                    //       return [...keys, imageName];
                    //     }
                    //     return keys.filter((key) => {
                    //       return key !== imageName;
                    //     });
                    //   });
                    // }}
                    onChange={(e) => {
                      // const newImages = currentImages.filter(
                      //   (image) => image !== imageName
                      // );
                      console.log(
                        "🚀 ~ file: MediaCard.tsx:149 ~ {currentImages?.map ~ productInfo?.removeBackgroundImages?.length:",
                        productInfo?.removeBackgroundImages
                      );
                      if (e.target.checked) {
                        if (productInfo?.removeBackgroundImages?.length > 0) {
                          const updatedDeletedImages = [
                            ...productInfo?.removeBackgroundImages,
                            imageName,
                          ];
                          onChangeHandler(
                            updatedDeletedImages,
                            "removeBackgroundImages"
                          );
                        } else {
                          onChangeHandler(
                            [imageName],
                            "removeBackgroundImages"
                          );
                        }
                        return;
                      }
                      const updatedDeletedImages =
                        productInfo.removeBackgroundImages.filter((key) => {
                          return key !== imageName;
                        });
                      onChangeHandler(
                        updatedDeletedImages,
                        "removeBackgroundImages"
                      );
                    }}
                  />
                </Group>
                {/* <Button
                  onClick={() => {
                    const newImages = currentImages.filter(
                      (image) => image !== imageName
                    );
                    if (productInfo?.deletedImages?.length > 0) {
                      const updatedDeletedImages = [
                        ...productInfo?.deletedImages,
                        imageName,
                      ];
                      onChangeHandler(updatedDeletedImages, "deletedImages");
                    } else {
                      onChangeHandler([imageName], "deletedImages");
                    }
                    onChangeHandler(newImages, "images");
                  }}
                  variant="outline"
                  size="xs"
                >
                  {t("Delete")}
                </Button> */}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default MediaCard;
