import {
  Box,
  Button,
  Card,
  Container,
  Group,
  MultiSelect,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId, useLocalStorage } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useConfigData } from "components/Menu/config";

import Translation from "components/Translation";
import { useUser } from "contexts/userContext/User";

import { t } from 'utils/i18nextFix';
import { useCreateCompany } from "pages/SignUp/hooks/useCreateCompany";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { getCountryInfo } from "utils/countryInfo";

const CreateCompany: React.FC = () => {
  const { loggedIn, userDocument, userId } = useUser();

  const { mutate } = useCreateCompany();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [companyInfo, setCompanyInfo] = useLocalStorage<any>({
    key: "companyInfo",
  });

  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      coords: "",
      address: "",
      companyType: [],
      companyName: "",
      companyPhone: "",
      country: "",
      city: "",

      agreeToTermsofService: false,
    },
  });
  const [, setManualLocation] = useState(false);
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

  const { lngs } = useConfigData();

  useEffect(() => {
    if (loggedIn) {
      if (typeof userDocument === "object") {
        if (Object.keys(userDocument).length > 0) {
          navigate("/", { replace: true });
        }
      }
    }
    if (!loggedIn) {
      navigate("/signup", { replace: true });
    }
  }, [loggedIn, userDocument]);
  const { countries, cities } = getCountryInfo();
  return (
    <Container mb={"50px"}>
      <Card shadow={"md"} m={"20px auto"}>
        <form
          onSubmit={form.onSubmit(async (values) => {
            const id = randomId();
            try {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { ...rest } = values;
              showNotification({
                title: t("Signing up"),
                message: t(""),
                id,
                loading: true,
                autoClose: false,
              });
              mutate({ ...form.values, userId });
              updateNotification({
                title: t("Signup successful"),
                message: t("Check your Email for comfirmation"),
                color: "green",
                autoClose: false,
                id,
              });
            } catch (e) {
              console.error(e);
              updateNotification({
                title: t("Error"),
                message: t("An Error occurred"),
                color: "red",
                autoClose: true,
                id,
              });
            }
          })}
        >
          <TextInput
            type="text"
            required
            label={t("Company name")}
            {...form.getInputProps("companyName")}
          />
          <TextInput
            type="number"
            required
            label={t("Company phone")}
            {...form.getInputProps("companyPhone")}
          />
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",

              flexFlow: "wrap",

              width: "100%",
            }}
          >
            <TextInput
              m={"auto"}
              label={t("Company location")}
              style={{
                marginTop: "12px",
                flexGrow: 0.9,
              }}
              placeholder={"32.4343, 13.545"}
              required
              {...form.getInputProps("coords")}
              onChange={(e) => {
                form.setFieldValue("coords", e.currentTarget.value);
                setManualLocation(true);
              }}
            />
            <Button
              m={"12px auto"}
              type="button"
              variant="outline"
              style={{
                width: "100%",
              }}
              onClick={() => {
                navigator.geolocation.getCurrentPosition(success, err);
              }}
            >
              {t("set your current location")}
            </Button>
          </Box>

          <MultiSelect
            label={t("Company type")}
            description={t("You can pick more than one")}
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
            onChange={(e) => {
              if (e.includes("restaurant")) {
                form.setFieldValue("companyType", ["restaurant"]);
                return;
              }
              form.setFieldValue("companyType", e);
            }}
            value={form.values.companyType}
          />

          <Group grow mt={12}>
            <Button
              type="submit"
              sx={{
                margin: "0px auto",
                width: "100%",
                maxWidth: "400px",
                alignSelf: "center",
              }}
            >
              {t("Create Company")}
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
};

export default CreateCompany;
