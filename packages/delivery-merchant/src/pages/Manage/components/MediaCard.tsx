import {
  ActionIcon,
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  FileInput,
  FileInputProps,
  Group,
  Image,
  Input,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { t } from "utils/i18nextFix";

import { ProductsCard } from "../types";
import { useState } from "react";
import ValueComponent from "components/PreviewImage";

interface MediaCardProps extends ProductsCard {
  currentImages?: string[];
}

/* function Value({ file }: { file: File }) {
  const reader = new FileReader();
  const [imageUrl, setImageUrl] = useState("");
  reader.onloadend = () => {
    const base64String = (reader.result as string)
      .replace("data:", "")
      .replace(/^.+,/, "");

    setImageUrl(`data:image/png;base64,${base64String}`);
  };

  reader.readAsDataURL(file);

  return (
    <Stack

    // sx={(theme) => ({
    //   backgroundColor:
    //     theme.colorScheme === "dark"
    //       ? theme.colors.dark[7]
    //       : theme.colors.gray[1],
    //   fontSize: theme.fontSizes.xs,
    //   padding: `${3} ${7}`,
    //   borderRadius: theme.radius.sm,
    // })}
    >
      <Box style={{ width: "150px" }}>
        <Image
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
          src={imageUrl}
        />
      </Box>

      <span
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          maxWidth: 200,
          display: "inline-block",
        }}
      >
        {file.name}
      </span>
    </Stack>
  );
}

const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
  if (Array.isArray(value)) {
    return (
      <Group spacing="sm" py="xs">
        {value.map((file, index) => (
          <Value file={file} key={index} />
        ))}
      </Group>
    );
  }

  return <Value file={value} />;
}; */
const MediaCard: React.FC<MediaCardProps> = ({
  onChangeHandler,
  productInfo,
  currentImages,
}) => {
  const { files } = productInfo;

  return (
    <Paper shadow={"sm"} p={"md"}>
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

        <FileInput
          label={t("Product pictures")}
          multiple
          value={productInfo.files}
          onChange={(newFiles) => {
            const uploadedFiles =
              files?.length > 0 ? [...files, ...newFiles] : [...newFiles];
            onChangeHandler(uploadedFiles, "files");
          }}
          valueComponent={ValueComponent}
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
                  {/* <Checkbox
                    onChange={(e) => {
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
                  /> */}
                </Group>
              </Box>
            );
          })}
          {productInfo?.deletedImages?.map((imageName, number) => {
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
                  sx={{
                    border: "1px solid red",
                    borderRadius: "6px",
                  }}
                  radius={6}
                  width={70}
                  height={70}
                  src={`${
                    import.meta.env.VITE_APP_BUCKET_URL
                  }/tablet/${imageName}`}
                  alt={t("product image")}
                />
                <Group>
                  <Button
                    compact
                    variant="light"
                    onClick={() => {
                      const newImages = productInfo?.deletedImages?.filter(
                        (image) => image !== imageName
                      );

                      onChangeHandler(newImages, "deletedImages");

                      onChangeHandler([...currentImages, imageName], "images");
                    }}
                  >
                    {t("Undo")}
                  </Button>

                  {/* <Checkbox
                    onChange={(e) => {
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
                  /> */}
                </Group>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default MediaCard;
