import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Group,
  Stack,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId, useLocalStorage } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useConfigData } from "components/Menu/config";
import Translation from "components/Translation";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { CardTest } from "hyfn-client";

interface LogInProps {}

const LogIn: React.FC<LogInProps> = () => {
  const initialValues: { email: string; password: string } = {
    email: "",
    password: "",
  };
  const form = useForm({
    initialValues: initialValues,
  });

  const location = useLocation();
  const [confirmed, setConfirmed] = useState(true);

  const [email, setEmail] = useState("");
  const locationState = location.state as { firstTimer: boolean };
  // const { logIn, user, resendConfirmationEmail } = useRealmApp()
  const {
    signIn,
    loggedIn,
    confirmSignUp,
    resendConfirmationEmail,

    sendPasswordChangeConfirmationCode,
    changePasswordAndConfirmCode,
  } = useUser();
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();
  const { lngs } = useConfigData();
  const [exception, setException] = useState({
    exception: false,
    message: "",
    code: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const changePasswordForm = useForm({
    initialValues: {
      confirmationCode: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (loggedIn) {
      console.log(loggedIn);

      navigate("/", { replace: true });
    }
  }, [loggedIn]);
  useEffect(() => {
    if (loggedIn) {
      if (locationState?.firstTimer) {
        showNotification({
          id: randomId(),
          title: "",
          message: "",
          autoClose: 3000,
        });

        navigate("/createstore", { replace: true });

        return;
      }
      navigate("/", { replace: true });
    }
  }, [loggedIn, locationState]);

  return (
    <Container
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: 'center',
      }}
    >
      {exception.exception && (
        <Alert title={t(exception.code)} color={"red"}>
          {t(exception.message)}
        </Alert>
      )}
      <Card
        shadow={"md"}
        // m={'0px auto'}
        // sx={{
        //   width: '380px',
        // }}
      >
        {changingPassword && (
          <Container>
            <form
              onSubmit={changePasswordForm.onSubmit(async (values) => {
                try {
                  if (
                    !String(form.values.email).match(
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )
                  ) {
                    showNotification({
                      message: "",
                      color: "red",
                    });
                    return;
                  }
                  await changePasswordAndConfirmCode({
                    email: form.values.email,
                    newPassword: values.newPassword,
                    code: values.confirmationCode,
                  });
                  setChangingPassword(false);
                } catch (error) {
                  console.log(
                    "🚀 ~ file: LogIn.tsx:113 ~ onSubmit={changePasswordForm.onSubmit ~ error",
                    error
                  );
                }
              })}
            >
              <Stack>
                <TextInput
                  label={t("Confirmation code")}
                  {...changePasswordForm.getInputProps("confirmationCode")}
                />
                <TextInput
                  label={t("New Password")}
                  {...changePasswordForm.getInputProps("newPassword")}
                />
                <Button type="submit">{t("Change")}</Button>
              </Stack>
            </form>
          </Container>
        )}
        {!confirmed && !changingPassword && (
          <Container
            sx={{
              flexDirection: "column",
              width: "100%",
            }}
            mb={16}
          >
            <Stack>
              <form
                onSubmit={async (e) => {
                  try {
                    e.preventDefault();
                    await confirmSignUp({
                      email: form.values.email,
                      code: verificationCode,
                    });
                  } catch (error) {
                    const { code, message } = error as {
                      code: string;
                      message: string;
                    };
                    console.log(message, "shshshsh");
                    setException({ exception: true, message, code });
                  }
                }}
              >
                <TextInput
                  mb={16}
                  sx={{ width: "100%" }}
                  label={t("Confirmation code")}
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                  }}
                />
                <Button fullWidth type="submit">
                  {t("Confirm account")}
                </Button>
              </form>
              <Button
                fullWidth
                // mt={4}
                onClick={async () => {
                  const id = randomId();
                  try {
                    showNotification({
                      message: "",
                      autoClose: false,
                      id,
                    });
                    resendConfirmationEmail({ username: form.values.email });
                    updateNotification({
                      message: "",
                      id,
                      autoClose: true,
                      color: "green",
                    });
                  } catch (error) {
                    updateNotification({
                      message: "",
                      id,
                      autoClose: true,
                      color: "red",
                    });
                  }
                }}
              >
                {t("Resend Confirmation email")}
              </Button>
            </Stack>
          </Container>
        )}{" "}
        {confirmed && !changingPassword && (
          <form
            onSubmit={form.onSubmit(async (values) => {
              const id = randomId();
              try {
                showNotification({
                  title: "",
                  message: "",
                  id,
                  loading: true,

                  autoClose: false,
                });
                const trimmedEmail = values.email.trim();
                await signIn({
                  email: trimmedEmail,
                  password: values.password,
                  navigate,
                });
                updateNotification({
                  title: "",
                  message: "",
                  id,
                  loading: false,

                  autoClose: true,
                });
              } catch (e) {
                console.error(e);
                updateNotification({
                  title: "",
                  message: "",
                  color: "red",
                  autoClose: true,
                  id,
                });

                const { message } = e as { message: string };
                if (message.includes("User is not confirmed")) {
                  setConfirmed(false);
                  setEmail(form.values.email);
                }
              }
            })}
          >
            <TextInput
              label={t("Email")}
              required
              {...form.getInputProps("email")}
            />
            <TextInput
              label={t("Password")}
              required
              type="password"
              {...form.getInputProps("password")}
            />
            <Box
              sx={{
                marginTop: "12px",
                display: "flex",
                flexDirection: "row-reverse",
                width: "100%",
              }}
            >
              <Button
                fullWidth
                type="submit"
                // sx={{
                //   width: '100%',
                //   maxWidth: '400px',
                // }}
              >
                {t("LogIn")}
              </Button>
            </Box>
          </form>
        )}
      </Card>
      <Group
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Group>
          <Link to="/signup">{t("Signup")}</Link>
          <UnstyledButton
            onClick={async () => {
              console.log(form.values.email);

              const validated = String(form.values.email).match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              );
              if (!validated) {
                showNotification({
                  message: "",
                  color: "red",
                });
                return;
              }
              try {
                await sendPasswordChangeConfirmationCode({
                  email: form.values.email,
                });
                setChangingPassword(true);
              } catch (error) {
                console.log("🚀 ~ file: LogIn.tsx:259 ~ error", error);
              }
            }}
          >
            {t("Forgot password")}
          </UnstyledButton>
        </Group>
        <Translation lngs={lngs} />
      </Group>
    </Container>
  );
};
export default LogIn;
