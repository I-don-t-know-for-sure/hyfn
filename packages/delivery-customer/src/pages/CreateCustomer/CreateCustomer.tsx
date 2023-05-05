import { Box, Button, Card, Container, Group, TextInput } from "@mantine/core";
import { randomId } from "@mantine/hooks";

import { t } from "../../util/i18nextFix";

import { Link, useNavigate } from "react-router-dom";

import { useCreateCustomer } from "./hooks/useCreateCustomer";

import { updateNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUser } from "../../contexts/userContext/User";
import { useTestNewDb } from "./hooks/useTestNewDb";

const CreateCustomer: React.FC = () => {
  const { mutate } = useCreateCustomer();
  const { mutate: testNewDb } = useTestNewDb();
  const { loggedIn, userDocument } = useUser();
  const form = useForm({
    initialValues: {
      name: "",
    },
  });
  const navigate = useNavigate();
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

  return (
    <Container>
      <Card shadow={"md"} mt={6}>
        <form
          onSubmit={form.onSubmit(async (values) => {
            const id = randomId();
            try {
              console.log(values);

              const { ...rest } = values;
              mutate(rest);
            } catch (e) {
              updateNotification({
                title: t("An Error occurred"),
                message: t("Error"),
                color: "red",
                loading: false,
                autoClose: true,
                id,
              });
              console.error(e);
            }
          })}
        >
          <Group spacing={"sm"} position={"center"} grow={true}>
            <TextInput
              type="text"
              required
              label={t("Name")}
              {...form.getInputProps("name")}
            />
          </Group>

          <Group mt={22} grow position="center">
            <Button type="submit">{t("Submit")}</Button>
          </Group>
        </form>
        <Button onClick={() => testNewDb()}>{"test"}</Button>
      </Card>
    </Container>
  );
};

export default CreateCustomer;
