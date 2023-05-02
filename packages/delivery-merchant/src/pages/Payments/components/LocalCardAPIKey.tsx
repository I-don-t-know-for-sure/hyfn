import {
  Button,
  Card,
  Center,
  Checkbox,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { t } from "utils/i18nextFix";
import React, { useEffect, useState } from "react";

interface LocalCardAPIKeyProps {
  TerminalId: string;
  MerchantId: string;
  secretKey: string;
  includeLocalCardFeeToPrice: boolean;
  localCardAPIKeyFilled: boolean;
  addLocalCardAPIkey: any;
  deleteLocalCardAPIKey: any;
  disableLocalCardAPIKeys: any;
  updateLocalCardSetting: any;
}

const LocalCardAPIKey: React.FC<LocalCardAPIKeyProps> = ({
  localCardAPIKeyFilled = false,
  MerchantId,
  TerminalId,
  secretKey,
  includeLocalCardFeeToPrice,
  addLocalCardAPIkey: addLocalCardAPIkey,
  deleteLocalCardAPIKey,
  disableLocalCardAPIKeys,
  updateLocalCardSetting,
}) => {
  const form = useForm({
    initialValues: {
      MerchantId: MerchantId || "",
      TerminalId: TerminalId || "",
      secretKey: secretKey || "",
      includeLocalCardFeeToPrice: includeLocalCardFeeToPrice || false,
    },
  });

  const [apiKeysFilled, setApiKeysFilled] = useState(localCardAPIKeyFilled);
  useEffect(() => {
    setApiKeysFilled(localCardAPIKeyFilled);
  }, [localCardAPIKeyFilled]);

  return (
    <Card
      shadow={"lg"}
      withBorder
      // mt={24}
    >
      <Group position="right">
        <Checkbox
          label={t("Include local card fee in price")}
          checked={includeLocalCardFeeToPrice}
          onClick={() => {
            updateLocalCardSetting();
          }}
        />
      </Group>
      {/* {localCardAPIKeyFilled && <Button onClick={() => deleteLocalCardAPIKey()}>{t('Delete')}</Button>} */}
      {apiKeysFilled && (
        <Button
          onClick={() => {
            setApiKeysFilled(false);
            form.setValues({ MerchantId: "", secretKey: "", TerminalId: "" });
          }}
        >
          {t("Edit")}
        </Button>
      )}
      {apiKeysFilled ? (
        <Group
        // direction="column"
        >
          <>
            <Group position="apart">
              <Text mt={12}>{t("Merchant Id")}</Text>
            </Group>
            <Skeleton
              // m={'4px auto'}
              animate={false}
              height={35}
              width={"100%"}
            ></Skeleton>
          </>
          <>
            <Group position="apart">
              <Text mt={12}>{t("Terminal Id")}</Text>
            </Group>
            <Skeleton
              // m={'4px auto'}
              animate={false}
              height={35}
              width={"100%"}
            ></Skeleton>
          </>
          <>
            <Group position="apart">
              <Text mt={12}>{t("Secret key")}</Text>
            </Group>
            <Skeleton
              // m={'4px auto'}
              animate={false}
              height={35}
              width={"100%"}
            ></Skeleton>
          </>
        </Group>
      ) : (
        <form
          onSubmit={form.onSubmit((values) => {
            if (
              Object.keys(values).length === 0 ||
              values.MerchantId === "" ||
              values.secretKey === "" ||
              values.TerminalId === ""
            ) {
              return;
            }
            addLocalCardAPIkey(values);
          })}
        >
          <Stack
          // direction="column"
          >
            <TextInput
              {...form.getInputProps("MerchantId")}
              label={t("Merchant Id")}
            />
            <TextInput
              label={t("Terminal Id")}
              {...form.getInputProps("TerminalId")}
            />
            <TextInput
              label={t("Secret key")}
              {...form.getInputProps("secretKey")}
            />
          </Stack>
          <Center mt={22}>
            <Group>
              <Button type="submit">{t("Update")}</Button>
              <Button
                onClick={() => {
                  disableLocalCardAPIKeys();
                }}
              >
                {t("Disable")}
              </Button>
              {localCardAPIKeyFilled && (
                <Button onClick={() => setApiKeysFilled(true)}>
                  {t("Cancel")}
                </Button>
              )}
            </Group>
          </Center>
        </form>
      )}
    </Card>
  );
};

export default LocalCardAPIKey;
