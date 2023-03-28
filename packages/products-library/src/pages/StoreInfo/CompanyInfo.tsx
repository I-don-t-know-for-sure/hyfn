import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Input,
  InputWrapper,
  Loader,
  MultiSelect,
  Select,
  Text,
  TextInput,
} from "@mantine/core";

import { useForm } from "@mantine/hooks";
import { Company } from "config/types";
import { useUser } from "contexts/userContext/User";
import { useGetUserDocument } from "hooks/useGetUserDocument";

import { t } from "utils/i18nextFix";

import React, { useEffect } from "react";
// import { Helmet } from "react-helmet-async";
import { getCountryInfo } from "utils/countryInfo";
import { storeTypes } from "utils/storeTypes";

import { useUpdateCompanyInfo } from "./hooks/useUpdateCompanyInfo";

interface CompanyInfoProps {}

const CompanyInfo: React.FC<CompanyInfoProps> = ({}) => {
  const { userId } = useUser();
  const {
    data = {},
    isLoading,
    isError,
    error,
    isFetched,
  } = useGetUserDocument({ userId });

  const { mutate } = useUpdateCompanyInfo();
  const initialInfo: Company = {
    companyType: [],
    companyName: "",
    companyPhone: "",

    country: "",
    city: "",
    description: "",
    coords: "",
    image: undefined,
  };

  const form = useForm({
    initialValues: initialInfo,
  });

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
  const types = storeTypes;

  useEffect(() => {
    if (data !== undefined) {
      const formData: Company = {
        companyName: data.companyName || data.businessName,
        country: data.country,
        city: data.city,
        description: data.description,
        companyType: data.companyType || data.businessType,
        companyPhone: data.companyPhone || data.businessPhone,
        coords: `${data?.coords?.coordinates[1]},${data?.coords?.coordinates[0]}`,
        // coords: "",
        image: data.image,
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
        alignItems: "center",
      }}
    >
      {/* <Helmet>
        <title>{t(isLoading ? "Loading" : "Company info")}</title>
      </Helmet> */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Text>{error}</Text>
      ) : (
        data && (
          <form
            onSubmit={form.onSubmit(async (values) => {
              mutate({ ...values, companyInfoFilled: true });
            })}
          >
            <Card
              sx={{
                margin: " 12px auto ",
              }}
            >
              <TextInput
                type="text"
                required
                label={t("Company name")}
                {...form.getInputProps("companyName")}
              />

              {/* <TextInput
                type="text"
                required
                label={t("Descripe your products in 4 words")}
                {...form.getInputProps("description")}
              /> */}
            </Card>
            <Card
              sx={{
                margin: " 12px auto ",
              }}
            >
              <Group grow>
                <InputWrapper label={t("Company logo")}>
                  <Input
                    type="file"
                    required={!data.image}
                    onChange={(e) => {
                      form.setFieldValue("imageObj", [...e.target.files]);
                    }}
                  />
                </InputWrapper>
                {data.image ? (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      width={100}
                      height={100}
                      radius={6}
                      mt={6}
                      src={`${import.meta.env.VITE_APP_BUCKET_URL}/tablet/${
                        data.image
                      }`}
                    />
                  </Box>
                ) : (
                  <Text>{t("no image yet")}</Text>
                )}
              </Group>
            </Card>
            <Card
              sx={{
                margin: " 12px auto ",
              }}
            >
              <Group grow>
                <TextInput
                  type="number"
                  required
                  label={t("Company phone")}
                  {...form.getInputProps("companyPhone")}
                />
              </Group>
            </Card>
            <Card
              sx={{
                margin: " 12px auto ",
              }}
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
                    form.values.country ? cities[`${form.values.country}`] : []
                  }
                  required
                  aria-label="City"
                  {...form.getInputProps("city")}
                />
              </Group>
              <Group>
                <TextInput
                  style={{
                    width: "75%",
                  }}
                  label={t("coords")}
                  {...form.getInputProps("coords")}
                  required
                />
                <Button
                  mt={28}
                  variant="outline"
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(success, err);
                  }}
                >
                  {t("Current coords")}
                </Button>
              </Group>
              <MultiSelect
                label={t("Company type")}
                required
                data={[
                  { value: "grocery", label: t("Grocery") },
                  { value: "clothes", label: t("Clothes") },
                  { value: "shoes", label: t("Shoes") },
                  { value: "stationery", label: t("Stationery") },
                  // { value: "electronics", label: t("Electronics") },
                  // {
                  //   value: "repair and spare parts",
                  //   label: t("Repair and spare parts"),
                  // },
                  // {
                  //   value: "construction materials",
                  //   label: t("Construction materials"),
                  // },
                  // { value: "furniture", label: t("Furniture") },

                  {
                    value: "watches, jewlery, and accessories",
                    label: t("Watches, jewlery, and accessories"),
                  },
                  {
                    value: "mother and child accessories",
                    label: t("Mother and child accessories"),
                  },
                  {
                    value: "cleaning meterials",
                    label: t("Cleaning meterials"),
                  },
                  { value: "games", label: t("Games") },
                ]}
                aria-label="company Type"
                onChange={(e) => {
                  if (e.includes("restaurant")) {
                    form.setFieldValue("companyType", ["restaurant"]);
                    return;
                  }
                  form.setFieldValue("companyType", e);
                }}
                value={form.values.companyType}
              />
            </Card>
            <Group
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                height: "150px",
              }}
            >
              <Button
                fullWidth
                sx={{
                  maxWidth: "450px",
                }}
                m={"0px auto"}
                type="submit"
              >
                {t("Update company Info")}
              </Button>
            </Group>
          </form>
        )
      )}
    </Container>
  );
};

export default CompanyInfo;
