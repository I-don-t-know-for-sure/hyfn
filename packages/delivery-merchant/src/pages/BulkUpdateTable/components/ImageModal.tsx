import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  FileInput,
  Group,
  Image,
  Modal,
  Text,
} from "@mantine/core";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { ActionTypes } from "../BulkUpdateTable";
import ValueComponent from "components/PreviewImage";

interface ImageModalProps {
  onChange: any;
  productInfo: any;
  _id: any;
}

const ImageModal: React.FC<ImageModalProps> = ({
  productInfo,
  onChange,
  _id,
}) => {
  const [opened, setOpened] = useState(false);
  const { files } = productInfo;
  const [filesState, setFiles] = useState<File[] | null>(files);
  const [imagesState, setImages] = useState<any[]>(productInfo.images);
  const [deletedImagesState, setDeletedImages] = useState<any[]>(
    productInfo.deletedImages
  );
  useEffect(() => {
    console.log("🚀 ~ file: ImageModal.tsx:31 ~ productInfo:", productInfo);
  }, [productInfo]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        sx={{
          width: "500px",
        }}
      >
        <Box>
          {filesState?.map((file, number) => {
            return (
              <Badge
                rightSection={
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => {
                      console.log(
                        "🚀 ~ file: ImageModal.tsx:36 ~ {files?.map ~ files:",
                        files.filter((oldFiles, index) => number !== index)
                      );
                      setFiles(
                        files.filter((oldFiles, index) => number !== index)
                      );
                      onChange({
                        type: ActionTypes.ON_CHANGE_HANDLER,
                        payload: {
                          value: files.filter(
                            (oldFiles, index) => number !== index
                          ),

                          firstChangedKey: "files",

                          _id,
                        },
                      });
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
            value={filesState}
            onChange={(newFiles) => {
              const uploadedFiles =
                files?.length > 0 ? [...files, ...newFiles] : [...newFiles];

              console.log(
                "🚀 ~ file: ImageModal.tsx:79 ~ uploadedFiles:",
                uploadedFiles
              );
              setFiles(newFiles);
              onChange({
                type: ActionTypes.ON_CHANGE_HANDLER,
                payload: {
                  value: uploadedFiles,

                  firstChangedKey: "files",

                  _id,
                },
              });
            }}
            valueComponent={ValueComponent}
          />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {imagesState?.map((imageName, number) => {
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
                        const newImages = productInfo?.images?.filter(
                          (image) => image !== imageName
                        );
                        if (productInfo?.deletedImages?.length > 0) {
                          const updatedDeletedImages = [
                            ...productInfo?.deletedImages,
                            imageName,
                          ];
                          onChange({
                            type: ActionTypes.ON_CHANGE_HANDLER,
                            payload: {
                              value: [updatedDeletedImages],

                              firstChangedKey: "deletedImages",

                              _id,
                            },
                          });
                          setDeletedImages([updatedDeletedImages]);
                        } else {
                          onChange({
                            type: ActionTypes.ON_CHANGE_HANDLER,
                            payload: {
                              value: [imageName],

                              firstChangedKey: "deletedImages",

                              _id,
                            },
                          });
                          setDeletedImages([imageName]);
                        }
                        console.log(
                          "🚀 ~ file: ImageModal.tsx:187 ~ {imagesState?.map ~ newImages:",
                          newImages
                        );
                        onChange({
                          type: ActionTypes.ON_CHANGE_HANDLER,
                          payload: {
                            value: newImages,

                            firstChangedKey: "images",

                            _id,
                          },
                        });
                        setImages(newImages);
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
                  </Group>
                </Box>
              );
            })}
            {deletedImagesState?.map((imageName, number) => {
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

                        onChange({
                          type: ActionTypes.ON_CHANGE_HANDLER,
                          payload: {
                            value: newImages,
                            firstChangedKey: "deletedImages",
                            _id,
                          },
                        });
                        setDeletedImages(newImages);

                        setImages([...productInfo.images, imageName]);
                        onChange({
                          type: ActionTypes.ON_CHANGE_HANDLER,
                          payload: {
                            value: [...productInfo.images, imageName],
                            firstChangedKey: "images",
                            _id,
                          },
                        });
                      }}
                    >
                      {t("Undo")}
                    </Button>
                  </Group>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Modal>
      <Button compact variant="subtle" onClick={() => setOpened(true)}>
        {t("Show images")}
      </Button>
    </>
  );
};

export default ImageModal;
