import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Input,
  Loader,
  MultiSelect,
  Paper,
  Select,
  Stack,
  Text,
  TextInput
} from "@mantine/core";

import { Store } from "config/types";

import React, { useEffect } from "react";
// import { Helmet } from 'react-helmet-async'
import { getCountryInfo } from "utils/countryInfo";

import useGetStoreInfo from "../../hooks/useGetStoreInfo";
import { useUpdateStoreInfo } from "./hooks/useUpdateStoreInfo";
import { useForm } from "@mantine/form";
import { storeTypesArray } from "hyfn-types";
import { t } from "utils/i18nextFix";

interface StoreInfoProps {}

const StoreInfo: React.FC<StoreInfoProps> = ({}) => {
  const { data, isLoading, isError, error, isFetched } = useGetStoreInfo();

  const { mutate, isLoading: isMutateLoading } = useUpdateStoreInfo();
  const initialInfo = {
    storeType: [],
    storeName: "",
    storePhone: "",

    country: "",
    city: "",
    description: "",
    coords: "",
    address: "",
    image: undefined
  };

  const form = useForm({
    initialValues: initialInfo
  });
  console.log("🚀 ~ file: StoreInfo.tsx:53 ~ form:", form);

  const err = (e) => {
    alert(e);
  };
  const success = (res) => {
    form.setFieldValue(
      "coords",
      `${res.coords.latitude}, ${res.coords.longitude}`
    );
    //alert(`lat: ${res.coords.latitude}, long: ${res.coords.longitude}`);
    localStorage.setItem("myLocation", JSON.stringify(res));
  };

  useEffect(() => {
    if (!data) return;
    if (!(Object.keys(data).length === 0)) {
      const formData: Store = {
        storeName: data.storeName,
        country: data.country,
        city: data.city,
        description: data.description,
        storeType: data.storeType,
        storePhone: data.storePhone,
        coords: `${data?.lat},${data?.long}`,
        // coords: "",
        image: data.image[0],
        address: data?.address
      };

      form.setValues(formData);
    }
  }, [isFetched]);
  const { countries, cities } = getCountryInfo();
  return (
    <Container
      sx={{
        justifyContent: "center",
        width: "100%",
        alignItems: "center"
      }}>
      {/* <Helmet>
        <title>{t(isLoading ? 'Loading' : 'Store Info')}</title>
      </Helmet> */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Text>{error as any}</Text>
      ) : (
        data && (
          <Stack>
            <form
              onSubmit={form.onSubmit(async (values) => {
                mutate({ ...values, storeInfoFilled: true });
              })}>
              <Paper
              // sx={{
              //   margin: ' 12px auto ',
              // }}
              >
                <TextInput
                  type="text"
                  required
                  label={t("Store Name")}
                  {...form.getInputProps("storeName")}
                />

                <TextInput
                  type="text"
                  required
                  label={t("Descripe what you serve in 4 words at most")}
                  {...form.getInputProps("description")}
                />
              </Paper>
              <Paper
              // sx={{
              //   margin: ' 12px auto ',
              // }}
              >
                <Group grow>
                  <Input.Wrapper label={t("Store Image")}>
                    <Input
                      type="file"
                      required={!data.image}
                      onChange={(e) => {
                        form.setFieldValue("imageObj", [...e.target.files]);
                      }}
                    />
                  </Input.Wrapper>
                  {data.image ? (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center"
                      }}>
                      <Image
                        width={100}
                        height={100}
                        radius={6}
                        // mt={6}
                        src={`${import.meta.env.VITE_APP_BUCKET_URL}/preview/${
                          data.image
                        }`}
                      />
                    </Box>
                  ) : (
                    <Text>{t("no image yet")}</Text>
                  )}
                </Group>
              </Paper>
              <Paper
              // sx={{
              //   margin: ' 12px auto ',
              // }}
              >
                <Group grow>
                  <TextInput
                    type="number"
                    required
                    label={t("store Phone")}
                    {...form.getInputProps("storePhone")}
                  />
                </Group>
              </Paper>
              <Paper
              // sx={{
              //   margin: ' 12px auto ',
              // }}
              >
                <Group spacing={"sm"} position={"center"} grow={true}>
                  <Select
                    label={t("Country")}
                    data={countries}
                    required
                    aria-label="Country"
                    {...form.getInputProps("country")}
                  />
                  <Select
                    label={t("City")}
                    data={
                      form.values.country
                        ? cities[`${form.values.country}`]
                        : []
                    }
                    required
                    aria-label="City"
                    {...form.getInputProps("city")}
                  />
                </Group>
                <Group>
                  <TextInput
                    style={{
                      width: "75%"
                    }}
                    label={t("coords")}
                    {...form.getInputProps("coords")}
                    required
                  />
                  <Button
                    // mt={28}
                    variant="outline"
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(success, err);
                    }}>
                    {t("current coords")}
                  </Button>
                </Group>
                <TextInput
                  label={t("Address")}
                  {...form.getInputProps("address")}
                />
                <MultiSelect
                  label={t("Store Type")}
                  required
                  data={storeTypesArray.map((type) => {
                    return { label: t(type), value: type };
                  })}
                  aria-label="Store Type"
                  onChange={(e) => {
                    if (e.includes("restaurant")) {
                      form.setFieldValue("storeType", ["restaurant"]);
                      return;
                    }
                    form.setFieldValue("storeType", e);
                  }}
                  value={form.values.storeType}
                />
              </Paper>
              <Group
                sx={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  height: "150px"
                }}>
                <Button
                  disabled={isMutateLoading}
                  fullWidth
                  // sx={{
                  //   maxWidth: '450px',
                  // }}
                  // m={'0px auto'}
                  type="submit">
                  {t("Update Store Info")}
                </Button>
              </Group>
            </form>
          </Stack>
        )
      )}
    </Container>
  );
};

export default StoreInfo;
