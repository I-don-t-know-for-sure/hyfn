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
  Text,
  TextInput,
} from "@mantine/core";

import { Store } from "config/types";

import { t } from "utils/i18nextFix";

import React, { useEffect } from "react";
// import { Helmet } from "react-helmet-async";
import { getCountryInfo } from "utils/countryInfo";
import { useCreateStore } from "./hooks/useCreateStore";
import { useForm } from "@mantine/form";
import { useUser } from "contexts/userContext/User";
import { useNavigate } from "react-router";

interface StoreInfoProps {}

const CreateStore: React.FC<StoreInfoProps> = ({}) => {
  const initialInfo: Store = {
    storeType: [],
    storeName: "",
    storePhone: "",

    country: "",
    city: "",
    description: "",
    coords: "",
    address: "",
    image: undefined,
  };

  const form = useForm({
    initialValues: initialInfo,
  });
  const { loggedIn, userDocument } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      if (
        typeof userDocument === "object" &&
        userDocument !== null &&
        userDocument !== undefined
      ) {
        if (Object.keys(userDocument).length > 0) {
          navigate("/", { replace: true });
        }
      }
    }
    if (!loggedIn) {
      navigate("/signup", { replace: true });
    }
  }, [loggedIn, userDocument]);
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
  const { mutate, isLoading: isMutateLoading } = useCreateStore();

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
        <title>{t("Create Store")}</title>
      </Helmet> */}

      <form
        onSubmit={form.onSubmit(async (values) => {
          mutate({ ...values, storeInfoFilled: true });
        })}
      >
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
              data={form.values.country ? cities[`${form.values.country}`] : []}
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
              // mt={28}
              variant="outline"
              onClick={() => {
                navigator.geolocation.getCurrentPosition(success, err);
              }}
            >
              {t("current coords")}
            </Button>
          </Group>
          <TextInput label={t("Address")} {...form.getInputProps("address")} />
          <MultiSelect
            label={t("Store Type")}
            required
            data={[
              { value: "restaurant", label: t("Restaurant") },
              { value: "grocery", label: t("Grocery") },
              { value: "clothes", label: t("Clothes") },
              { value: "shoes", label: t("Shoes") },

              { value: "stationery", label: t("Stationery") },
              // { value: 'electronics', label: t('Electronics') },
              // {
              //   value: 'repair and spare parts',
              //   label: t('Repair and spare parts'),
              // },
              // {
              //   value: 'construction materials',
              //   label: t('construction materials'),
              // },
              // { value: 'furniture', label: t('furniture') },
              {
                value: "bakery",
                label: t("Bakery"),
              },
              {
                value: "sweets",
                label: t("Sweets"),
              },
              {
                value: "watches, jewwlry, and accessories",
                label: t("Watches, jewwlry, and accessories"),
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
              // { value: 'meat store', label: t('Meat store') },
            ]}
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
            height: "150px",
          }}
        >
          <Button
            disabled={isMutateLoading}
            fullWidth
            // sx={{
            //   maxWidth: '450px',
            // }}
            // m={'0px auto'}
            type="submit"
          >
            {t("Submit store Info")}
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default CreateStore;
