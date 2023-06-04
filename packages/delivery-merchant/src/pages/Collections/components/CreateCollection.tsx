import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Stack,
  Text,
} from "@mantine/core";
import InfoCard from "components/InfoCard";
import usePersistState from "hooks/usePersistState";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import { CollectionCard, CollectionInfo } from "../types";
import TypeCard from "./TypeCard";

import StatusCard from "./CollectionCard";
import { t } from "utils/i18nextFix";
import fetchUtil from "utils/fetch";

import { randomId } from "@mantine/hooks";
// import { Helmet } from 'react-helmet-async'

import { useNavigate } from "react-router";
import ProductsSelection from "./ProductsSelection";
import { useUser } from "contexts/userContext/User";
/*
needs refactoring
*/
interface CreateCollectionProps {
  requestType: "create" | "open";
}

const CreateCollection: React.FC<CreateCollectionProps> = ({ requestType }) => {
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo>({
    title: "",
    description: "",

    collectionType: "manual",
    isActive: true,
  });
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
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

  const id = randomId();

  const { userId, userDocument } = useUser();
  const { mutate, data } = useMutation(
    async (collection: { collection: CollectionInfo }) => {
      try {
        console.log(
          "🚀 ~ file: CreateCollection.tsx:65 ~ collection",
          collection
        );

        console.log(`${import.meta.env.VITE_APP_BASE_URL}/createCollection`);

        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/createCollection`,
          reqData: [collection.collection, userDocument?.storeDoc],
        });

        return result;
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["collections"]);
      },
    }
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      navigate(`/collection/${data}`, { replace: true });
    }
  }, [data, navigate]);

  return (
    <Container m={2} mt={8}>
      {/* <Helmet>
        <title>{t('New Collection')}</title>
      </Helmet> */}

      <Grid grow>
        <Grid.Col sm={3} md={6} lg={7}>
          <Stack>
            <InfoCard onChangeHandler={onChangeHandler} info={collectionInfo} />
            <TypeCard
              onChangeHandler={onChangeHandler}
              collectionInfo={collectionInfo}
              setCollectionInfo={setCollectionInfo}
            />
            <ProductsSelection
              collectionInfo={collectionInfo}
              onChangeHandler={onChangeHandler}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col sm={1} md={3} lg={3}>
          <StatusCard
            collectionInfo={collectionInfo}
            onChangeHandler={onChangeHandler}
          />
        </Grid.Col>
      </Grid>

      <Container
        sx={{
          display: "flex",

          margin: "40px 24px",
        }}
      >
        <Button
          fullWidth
          m={"0px auto"}
          sx={{
            maxWidth: "450px",
          }}
          onClick={() => {
            if (
              !(collectionInfo?.conditions?.conditionArray?.length > 0) &&
              collectionInfo.collectionType === "automated"
            ) {
              setError(
                t("automated collections must have at least one condition")
              );
            } else {
              console.log("hshshshshshsh");

              mutate({
                collection: collectionInfo,
              });
            }
          }}
        >
          {t("Create")}
        </Button>
      </Container>
    </Container>
  );
};

export default CreateCollection;
