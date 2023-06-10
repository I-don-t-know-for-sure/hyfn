import {
  Button,
  Container,
  Group,
  MultiSelect,
  Paper,
  Select,
  Stack,
  TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { t } from "../../utils/i18nextFix";

import React, { useEffect, useState } from "react";
import { useUpdateManagerInfo } from "./hooks/useUpdateManagerInfo";
import { getCountryInfo } from "utils/countryInfo";
import { useUser } from "contexts/userContext/User";

import { useAddLocalCardKeys } from "./hooks/useAddLocalCardKeys";
import { useDisableLocalCardKeys } from "./hooks/useDisableLocalCardKeys";
import { useAddEmployee } from "./hooks/useAddEmployee";

interface ManagementInfoProps {}

const ManagementInfo: React.FC<ManagementInfoProps> = ({}) => {
  const form = useForm({
    initialValues: {
      managementName: "",
      managementPhone: "",
      managementAddress: "",
      country: "",
      managementCut: 0,
      deliverFrom: [],
      deliverTo: []
    }
  });

  const localCardKeysForm = useForm({
    initialValues: {
      merchantId: "",
      terminalId: "",
      secretKey: ""
    }
  });

  const [employeeId, setEmployeeId] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const { userDocument, isLoading } = useUser();
  useEffect(() => {
    if (userDocument && !isLoading) {
      form.setValues({
        managementAddress: userDocument.managementAddress,
        country: userDocument.country,
        managementName: userDocument.managementName,
        managementPhone: userDocument.managementPhone,
        managementCut: userDocument.managementCut,
        deliverFrom: userDocument.deliverFrom,
        deliverTo: userDocument.deliverTo
      });
      localCardKeysForm.setValues({
        merchantId: userDocument?.localCardKeys?.MerchantId,
        terminalId: userDocument?.localCardKeys?.TerminalId,
        secretKey: userDocument?.localCardKeys?.secretKey
      });
    }
  }, [userDocument, isLoading]);

  const { countries, cities } = getCountryInfo();

  const { mutate } = useUpdateManagerInfo();
  const { mutate: addLocalCardKeys } = useAddLocalCardKeys();
  const { mutate: disableLocalCardKeys } = useDisableLocalCardKeys();
  const { mutate: addEmployee } = useAddEmployee();

  return (
    <Container mt={12}>
      <Stack>
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
              <Button type={"submit"}>{t("Update management")}</Button>
            </Stack>
          </form>
        </Paper>

        <Paper>
          <Stack>
            <TextInput
              label={t("Merchant Id")}
              value={localCardKeysForm.values.merchantId}
              onChange={(e) => {
                localCardKeysForm.setFieldValue("merchantId", e.target.value);
              }}
            />
            <TextInput
              label={t("Terminal Id")}
              value={localCardKeysForm.values.terminalId}
              onChange={(e) => {
                localCardKeysForm.setFieldValue("terminalId", e.target.value);
              }}
            />
            <TextInput
              label={t("Secure key")}
              value={localCardKeysForm.values.secretKey}
              onChange={(e) => {
                localCardKeysForm.setFieldValue("secretKey", e.target.value);
              }}
            />
            {editing ? (
              <>
                <Button
                  onClick={() => {
                    addLocalCardKeys(localCardKeysForm.values);
                  }}>
                  {t("Update")}
                </Button>
                <Button
                  onClick={() => {
                    disableLocalCardKeys();
                  }}>
                  {t("Disable")}
                </Button>
              </>
            ) : userDocument?.localCardAPIKeyFilled ? (
              <Button onClick={() => setEditing(true)}>{t("Edit")}</Button>
            ) : (
              <Button
                onClick={() => {
                  addLocalCardKeys(localCardKeysForm.values);
                }}>
                {t("Add keys")}
              </Button>
            )}
          </Stack>
        </Paper>
        <Paper>
          <Stack>
            <TextInput
              label={t("Add employee")}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <Button onClick={() => addEmployee({ employeeId })}>
              {t("Add employee")}
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ManagementInfo;
