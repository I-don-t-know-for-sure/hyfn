import { Box, Button, Grid, Group, Stack } from "@mantine/core";
import InfoCard from "components/InfoCard";

import React, { useEffect, useState } from "react";

import { CollectionCard, CollectionInfo } from "../types";
import TypeCard from "./TypeCard";

import { useParams } from "react-router";

import StatusCard from "./CollectionCard";
import { t } from "utils/i18nextFix";
// import { Helmet } from 'react-helmet-async'

import ProductsSelection from "./ProductsSelection";
import { useGetCollection } from "../hooks/useGetCollection";
import { useUpdateCollection } from "../hooks/useUpdateColection";
import { useDeleteCollection } from "../hooks/useDeleteCollection";

interface UpdateCollectionProps {}

const UpdateCollection: React.FC<UpdateCollectionProps> = () => {
  const { collectionId } = useParams<{ collectionId: string }>();

  const { data, isFetched, isLoading } = useGetCollection(collectionId);

  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo>({
    title: "",
    description: "",

    collectionType: "manual",
    isActive: true,
  });

  useEffect(() => {
    if (data) {
      setCollectionInfo(data);
    }
  }, [isFetched]);

  const onChangeHandler: CollectionCard["onChangeHandler"] = (
    value: any,
    firstChangedKey: string,
    changedKey?: string
  ) => {
    setCollectionInfo((prevState: any) => {
      if (changedKey === undefined) {
        return {
          ...prevState,
          [`${firstChangedKey}`]: value,
        };
      }

      return {
        ...prevState,
        [`${firstChangedKey}`]: {
          ...prevState[`${firstChangedKey}`],
          [`${changedKey}`]: value,
        },
      };
    });
  };

  const { mutate } = useUpdateCollection();
  const { mutate: deleteColelction } = useDeleteCollection();

  return (
    <Box m={"md"}>
      {/* <Helmet>
        <title>{t(isLoading ? 'Loading' : collectionInfo?.textInfo?.title)}</title>
      </Helmet> */}
      <Stack>
        <Grid grow>
          <Grid.Col sm={2} md={6} lg={7}>
            <Stack>
              <InfoCard
                onChangeHandler={onChangeHandler}
                info={collectionInfo}
                isLoading={isLoading}
              />
              <TypeCard
                onChangeHandler={onChangeHandler}
                collectionInfo={collectionInfo}
                isLoading={isLoading}
                setCollectionInfo={setCollectionInfo}
              />
              <ProductsSelection
                collectionId={collectionId}
                isLoading={isLoading}
                collectionInfo={collectionInfo}
                onChangeHandler={onChangeHandler}
              />
            </Stack>
          </Grid.Col>
          <Grid.Col sm={2} md={3} lg={2}>
            <StatusCard
              isLoading={isLoading}
              collectionInfo={collectionInfo}
              onChangeHandler={onChangeHandler}
            />
          </Grid.Col>
        </Grid>

        <Group
          position="apart"
          mt={10}
          sx={{
            display: "flex",

            margin: "40px 24px",
          }}
        >
          <Button
            sx={(theme) => ({
              minWidth: "70px",
              [theme.fn.smallerThan("md")]: {
                width: "100%",
                maxWidth: "450px",
              },
            })}
            onClick={() => {
              deleteColelction(collectionId);
            }}
            variant="outline"
            color={"red"}
          >
            {t("Delete collection")}
          </Button>
          <Button
            fullWidth
            sx={{
              maxWidth: "450px",
            }}
            onClick={() => {
              mutate({ collectionId, collection: collectionInfo });
            }}
          >
            {t("Update")}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default UpdateCollection;
