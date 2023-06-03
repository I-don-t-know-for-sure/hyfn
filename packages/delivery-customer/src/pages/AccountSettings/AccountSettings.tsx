import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Group,
  NumberInput,
  NumberInputHandlers,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from "hyfn-client";

import { t } from "../../util/i18nextFix";
import React, { useRef, useState } from "react";

import useUpdateUSerDocument from "./hooks/useUpdateUserDocument";
import { useForm } from "@mantine/form";
import { useSubscribeToHyfnPlus } from "./hooks/useSubscribeToHyfnPlus";
import { useUser } from "contexts/userContext/User";
import { convertDateToText } from "hyfn-client";

interface AccountSettingsProps {}

const AccountSettings: React.FC<AccountSettingsProps> = ({}) => {
  const form = useForm({
    initialValues: {
      name: "",
    },
  });
  const [value, setValue] = useState<number>(0);
  const handlers = useRef<NumberInputHandlers>();
  const { mutate } = useUpdateUSerDocument();
  const { mutate: subscribeToHyfnPlus } = useSubscribeToHyfnPlus();
  const { userDocument } = useUser();

  return (
    <Container mt={8}>
      <Stack spacing={8}>
        <Card shadow={"md"}>
          <form
            onSubmit={form.onSubmit(async (values) => {
              try {
                const { ...rest } = values;
                mutate({ newUserInfo: rest });
              } catch (e) {
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

            <Group position="apart" mt="xl">
              {/* <Button
              fullWidth
              variant="light"
              onClick={async () => {
                // await sendResetPasswordEmail();
              }}
              >
              {t('change password')}
            </Button> */}
              <Button fullWidth type="submit">
                {t("Set Account Info")}
              </Button>
            </Group>
          </form>
        </Card>

        <Card>
          <Group align="start">
            <Title order={3} align="center">
              {t("Hyfn+ subscription")}
            </Title>
          </Group>

          <Stack align="center">
            {userDocument.expirationDate !== null &&
              userDocument.expirationDate !== undefined && (
                <Text>
                  {`${t("Expiration date")} : ${convertDateToText(
                    userDocument.expirationDate
                  )}`}
                </Text>
              )}
            <Group spacing={5}>
              <ActionIcon
                size={42}
                variant="default"
                onClick={() => handlers.current.decrement()}
              >
                –
              </ActionIcon>

              <NumberInput
                hideControls
                value={value}
                onChange={(val) => setValue(val as number)}
                handlersRef={handlers}
                max={12}
                min={1}
                styles={{ input: { width: rem(54), textAlign: "center" } }}
              />

              <ActionIcon
                size={42}
                variant="default"
                onClick={() => handlers.current.increment()}
              >
                +
              </ActionIcon>
            </Group>
            <Button
              onClick={() => {
                subscribeToHyfnPlus({ numberOfMonths: value });
              }}
            >
              {t("Subscribe to hyfn+")}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default AccountSettings;
