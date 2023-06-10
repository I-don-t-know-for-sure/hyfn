import {
  Button,
  Container,
  Group,
  MultiSelect,
  Paper,
  Select,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { useCreateManagerAccount } from "./hooks/useCreateManagerAccount";
import { t } from "utils/i18nextFix";
import { getCountryInfo } from "../../utils/countryInfo";
import { CopyButton, CopyTextButton } from "hyfn-client";
import { useUser } from "contexts/userContext/User";

interface CreateManagerAccountProps {}

const CreateManagerAccount: React.FC<CreateManagerAccountProps> = ({}) => {
  const form = useForm({
    initialValues: {
      managementName: "",
      managementPhone: "",
      managementAddress: "",
      country: "",
      deliverFrom: [],
      deliveryTo: []
    }
  });
  const { mutate } = useCreateManagerAccount();
  const { countries, cities } = getCountryInfo();
  const { userId } = useUser();
  return (
    <Container mt={12}>
      <Stack>
        <Paper>
          <Stack align="center">
            <Text> {t("If you are an employee copy your id below.")} </Text>
            <CopyTextButton value={userId} />
          </Stack>
        </Paper>
        <Paper>
          <form
            onSubmit={form.onSubmit(async (values) => {
              mutate(values);
            })}>
            <Stack>
              <TextInput
                type="text"
                label={t("Management name")}
                {...form.getInputProps("managementName")}
              />
              <Select
                label={t("Country")}
                data={countries}
                {...form.getInputProps("country")}
              />
              <Group grow>
                <MultiSelect
                  label={t("Deliver from")}
                  data={cities.Libya}
                  {...form.getInputProps("deliverFrom")}
                />
                <MultiSelect
                  label={t("Deliver to")}
                  data={cities.Libya}
                  {...form.getInputProps("deliverTo")}
                />
              </Group>
              <Group grow>
                <TextInput
                  type="number"
                  label={t("Phone number")}
                  {...form.getInputProps("managementPhone")}
                />
                <TextInput
                  type="text"
                  label={t("Management address")}
                  {...form.getInputProps("managementAddress")}
                />
              </Group>
              <Button type={"submit"}>{t("Create management")}</Button>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
};

export default CreateManagerAccount;
