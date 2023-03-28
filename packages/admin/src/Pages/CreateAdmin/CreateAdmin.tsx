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
  Select,
  Text,
  TextInput,
} from "@mantine/core";

import { t } from "utils/i18nextFix";

import React, { useEffect } from "react";

import { useForm } from "@mantine/form";

import { useNavigate } from "react-router";
import { useUser } from "../../contexts/userContext/User";
import { useCreateAdmin } from "./hooks/useCreateAdmin";
// import { Helmet } from "react-helmet-async";

interface CreateAdminProps {}

const CreateAdmin: React.FC<CreateAdminProps> = ({}) => {
  const initialInfo = {
    adminName: "",
  };

  const form = useForm({
    initialValues: initialInfo,
  });
  const { loggedIn, userDocument } = useUser();
  const navigate = useNavigate();
  const { mutate, isLoading: isMutateLoading } = useCreateAdmin();
  useEffect(() => {
    if (loggedIn) {
      if (
        typeof userDocument === "object" &&
        userDocument !== undefined &&
        userDocument !== null
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
          mutate({ adminInfo: values });
        })}
      >
        <Card
        // sx={{
        //   margin: ' 12px auto ',
        // }}
        >
          <TextInput
            type="text"
            required
            label={t("Admin Name")}
            {...form.getInputProps("adminName")}
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
            disabled={isMutateLoading}
            fullWidth
            // sx={{
            //   maxWidth: '450px',
            // }}
            // m={'0px auto'}
            type="submit"
          >
            {t("Submit Admin Info")}
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default CreateAdmin;
