import {
  Button,
  Container,
  Group,
  Paper,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { useCreateManagerAccount } from "./hooks/useCreateManagerAccount";
import { t } from 'utils/i18nextFix';
import { getCountryInfo } from "../../utils/countryInfo";

interface CreateManagerAccountProps {}

const CreateManagerAccount: React.FC<CreateManagerAccountProps> = ({}) => {
  const form = useForm({
    initialValues: {
      managementName: "",
      managementPhone: "",
      managementAddress: "",
      country: "",
    },
  });
  const { mutate } = useCreateManagerAccount();
  const { countries } = getCountryInfo();
  return (
    <Container mt={12}>
      <Paper>
        <form
          onSubmit={form.onSubmit(async (values) => {
            mutate(values);
          })}
        >
          <Stack>
            <TextInput
              type="text"
              label={t("Management name")}
              {...form.getInputProps("managementName")}
            />
            <Group grow>
              <Select
                label={t("Country")}
                data={countries}
                {...form.getInputProps("country")}
              />
              <TextInput
                type="number"
                label={t("Phone number")}
                {...form.getInputProps("managementPhone")}
              />
            </Group>
            <TextInput
              type="text"
              label={t("Management address")}
              {...form.getInputProps("managementAddress")}
            />
            <Button type={"submit"}>{t("Create management")}</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateManagerAccount;
