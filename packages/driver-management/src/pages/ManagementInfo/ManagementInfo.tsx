import {
  ActionIcon,
  Button,
  Center,
  Container,
  Group,
  NumberInput,
  NumberInputHandlers,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { t } from "../../utils/i18nextFix";
import { useCreateManagerAccount } from "pages/CreateManagerAccount/hooks/useCreateManagerAccount";
import React, { useEffect, useRef, useState } from "react";
import { useUpdateManagerInfo } from "./hooks/useUpdateManagerInfo";
import { getCountryInfo } from "utils/countryInfo";
import { useUser } from "contexts/userContext/User";
import { MAXIMUM_MANAGEMENT_CUT } from "hyfn-types";
import { useAddLocalCardKeys } from "./hooks/useAddLocalCardKeys";
import { useDisableLocalCardKeys } from "./hooks/useDisableLocalCardKeys";

interface ManagementInfoProps {}

const ManagementInfo: React.FC<ManagementInfoProps> = ({}) => {
  const form = useForm({
    initialValues: {
      managementName: "",
      managementPhone: "",
      managementAddress: "",
      country: "",
      managementCut: 0,
    },
  });

  const localCardKeysForm = useForm({
    initialValues: {
      merchantId: "",
      terminalId: "",
      secretKey: "",
    },
  });

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
      });
      localCardKeysForm.setValues({
        merchantId: userDocument?.localCardKeys?.MerchantId,
        terminalId: userDocument?.localCardKeys?.TerminalId,
        secretKey: userDocument?.localCardKeys?.secretKey,
      });
    }
  }, [userDocument, isLoading]);

  const { countries } = getCountryInfo();

  const { mutate } = useUpdateManagerInfo();
  const { mutate: addLocalCardKeys } = useAddLocalCardKeys();
  const { mutate: disableLocalCardKeys } = useDisableLocalCardKeys();

  return (
    <Container mt={12}>
      <Stack>
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
                {...form.getInputProps("managementPhone")}
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

              {/* <NumberInput
                min={0}
                max={MAXIMUM_MANAGEMENT_CUT}
                precision={2}
                step={0.05}
                withAsterisk={false}
                label={t("Management cut")}
                {...form.getInputProps("managementCut")}
                rightSection={
                  <Center mr={40}>
                    <ActionIcon
                      sx={(theme) => ({
                        width: "60px",
                        color: theme.primaryColor,
                      })}
                      onClick={() => {
                        form.setFieldValue("managementCut", 1);
                      }}
                    >
                      <Text>{t("100%")}</Text>
                    </ActionIcon>
                  </Center>
                }
              /> */}
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
                  }}
                >
                  {t("Update")}
                </Button>
                <Button
                  onClick={() => {
                    disableLocalCardKeys();
                  }}
                >
                  {t("Disable")}
                </Button>
              </>
            ) : userDocument?.localCardAPIKeyFilled ? (
              <Button onClick={() => setEditing(true)}>{t("Edit")}</Button>
            ) : (
              <Button
                onClick={() => {
                  addLocalCardKeys(localCardKeysForm.values);
                }}
              >
                {t("Add keys")}
              </Button>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ManagementInfo;
