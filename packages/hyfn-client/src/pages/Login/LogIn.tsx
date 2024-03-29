import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId, useLocalStorage } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { lngs } from "hyfn-types";
import Translation from "../../components/Translation";

import { t } from "i18next";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useUser } from "../../context/User";

interface LogInProps {}

export const LogIn: React.FC<LogInProps> = () => {
  const initialValues: { email: string; password: string } = {
    email: "",
    password: "",
  };
  const location = useLocation();

  const form = useForm({
    initialValues: initialValues,
  });
  const {
    refetch,
    signIn,
    loggedIn,
    confirmSignUp,
    resendConfirmationEmail,
    sendPasswordChangeConfirmationCode,
    changePasswordAndConfirmCode,
  } = useUser();
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(true);

  const [email, setEmail] = useState("");

  // const { refetch } = useCustomerData();
  const [verificationCode, setVerificationCode] = useState("");

  const [exception, setException] = useState({
    exception: false,
    message: "",
    code: "",
  });
  const state = location.state as { firstTimer: boolean };
  useEffect(() => {
    if (loggedIn) {
      if (state?.firstTimer) {
        showNotification({
          id: randomId(),
          title: t("successful signup"),
          message: t("just log into your account now ") as any,
          autoClose: 3000,
        });
        navigate("/createcustomer", { replace: true });
        return;
      }

      navigate("/home", { replace: true });
      localStorage.removeItem("customerInfo");
    }
  }, [loggedIn]);

  // useEffect(() => {
  //   if (user && user?.app?.currentUser?.providerType !== "anon-user") {
  //   }
  //   if (user && user?.app?.currentUser?.providerType === "anon-user") {
  //     user.logOut();
  //   }
  // });
  const changePasswordForm = useForm({
    initialValues: {
      confirmationCode: "",
      newPassword: "",
    },
  });
  return (
    <Container
      sx={{
        height: "80vh",
        // width: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: 'center',
      }}
    >
      {exception.exception && (
        <Alert title={t(exception.code) as any} color={"red"}>
          {t(exception.message) as any}
        </Alert>
      )}
      <Card
        shadow={"md"}
        m={" auto"}
        sx={{
          width: "380px",
          // alignSelf: 'center',
          // justifySelf: 'center',
        }}
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
                      message: t("does not match email pattern") as any,
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
                  label={t("Confirmation code") as any}
                  {...changePasswordForm.getInputProps("confirmationCode")}
                />
                <TextInput
                  label={t("New Password") as any}
                  {...changePasswordForm.getInputProps("newPassword")}
                />
                <Button type="submit">{t("Change") as any}</Button>
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
            <form
              onSubmit={async (e) => {
                try {
                  e.preventDefault();
                  await confirmSignUp({
                    email: form.values.email,
                    code: verificationCode,
                    navigate,
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
                label={t("Confirmation code") as any}
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                }}
              />
              <Button fullWidth type="submit">
                {t("Confirm account") as any}
              </Button>
            </form>
            <Button
              fullWidth
              mt={4}
              onClick={async () => {
                const id = randomId();
                try {
                  showNotification({
                    message: t("sending confirmation email") as any,
                    autoClose: false,
                    id,
                  });
                  resendConfirmationEmail({ username: form.values.email });
                  updateNotification({
                    message: t("email was sent") as any,
                    id,
                    autoClose: true,
                    color: "green",
                  });
                } catch (error) {
                  const { status, message, name, code } = error as {
                    message: string;
                    status: any;
                    code: string;
                    name: string;
                  };
                  setException({ exception: true, code, message });

                  updateNotification({
                    message: t("an error occured") as any,
                    id,
                    autoClose: true,
                    color: "red",
                  });
                }
              }}
            >
              {t("Resend Confirmation email") as any}
            </Button>
          </Container>
        )}{" "}
        {confirmed && !changingPassword && (
          <form
            onSubmit={form.onSubmit(async (values) => {
              const id = randomId();
              try {
                showNotification({
                  title: t("Logging in"),
                  message: t("In progress") as any,
                  loading: true,
                  autoClose: false,
                  id,
                });
                const trimmedEmail = values.email.trim();
                if (state?.firstTimer) {
                  await signIn({
                    email: trimmedEmail,
                    password: values.password,
                  });
                  await refetch();
                } else {
                  await signIn({
                    email: trimmedEmail,
                    password: values.password,
                  });

                  await refetch();
                }
                updateNotification({
                  title: t("Logged in"),
                  message: t("Successful") as any,
                  color: "green",
                  loading: false,
                  autoClose: true,
                  id,
                });
              } catch (e) {
                const { code, message } = e as {
                  code: string;
                  message: string;
                };
                console.log(Object.keys(e));
                if (code.includes("UserNotConfirmedException")) {
                  setConfirmed(false);
                  setEmail(form.values.email);
                }
                setException({ exception: true, message, code });
                // if(code.includes('UserNotFoundException')){

                // }
                updateNotification({
                  title: t("An Error occurred"),
                  message: t("Error") as any,
                  color: "red",
                  loading: false,
                  autoClose: true,
                  id,
                });
                console.error(e);
              }
            })}
          >
            <TextInput
              label="Email"
              required
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Password"
              type="password"
              required
              {...form.getInputProps("password")}
            />

            <Button mt={16} fullWidth type="submit">
              {t("LogIn") as any}
            </Button>
          </form>
        )}
        <Box
          sx={{
            margin: "16px auto 6px auto",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "baseline",
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
                    message: t("Not email pattern") as any,
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
              {t("Forgot password") as any}
            </UnstyledButton>
          </Group>

          <Translation lngs={lngs} />
        </Box>
      </Card>
    </Container>
  );
};
