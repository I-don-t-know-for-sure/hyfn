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
import { randomId, useForm, useLocalStorage } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useConfigData } from "components/Menu/config";
import Translation from "components/Translation";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { userInfo } from "os";
import { useCreateCompany } from "pages/SignUp/hooks/useCreateCompany";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

interface LogInProps {}

const LogIn: React.FC<LogInProps> = () => {
  const initialValues: { email: string; password: string } = {
    email: "",
    password: "",
  };
  const form = useForm({
    initialValues: initialValues,
  });
  const { mutate } = useCreateCompany();
  const { firstlogin } = useParams<{ firstlogin: string }>();
  const location = useLocation();

  const [confirmed, setConfirmed] = useState(true);
  const [email, setEmail] = useState("");

  const {
    signIn,
    loggedIn,
    resendConfirmationEmail,
    confirmSignUp,
    sendPasswordChangeConfirmationCode,
    changePasswordAndConfirmCode,
  } = useUser();
  const [changingPassword, setChangingPassword] = useState(false);
  const changePasswordForm = useForm({
    initialValues: {
      confirmationCode: "",
      newPassword: "",
    },
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [exception, setException] = useState({
    exception: false,
    message: "",
    code: "",
  });

  const navigate = useNavigate();
  const { lngs } = useConfigData();
  const [companyInfo] = useLocalStorage<any>({
    key: "companyInfo",
  });

  useEffect(() => {
    if (loggedIn) {
      navigate("/", { replace: true });
    }
  }, [loggedIn]);

  return (
    <Container
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      {exception.exception && (
        <Alert title={t(exception.code)} color={"red"}>
          {t(exception.message)}
        </Alert>
      )}
      <Card
        shadow={"md"}
        m={"auto auto"}
        sx={{
          width: "380px",
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
                      message: t("does not match email pattern"),
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
                } catch (error) {}
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
              mt={4}
              onClick={async () => {
                const id = randomId();
                try {
                  showNotification({
                    message: t("sending confirmation email"),
                    autoClose: false,
                    id,
                  });
                  resendConfirmationEmail({ username: form.values.email });
                  updateNotification({
                    message: t("email was sent"),
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
                    message: t("an error occured"),
                    id,
                    autoClose: true,
                    color: "red",
                  });
                }
              }}
            >
              {t("Resend Confirmation email")}
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
                  message: "",
                  id,
                  loading: true,

                  autoClose: false,
                });
                const trimmedEmail = values.email.trim();
                await signIn({
                  email: trimmedEmail,
                  password: values.password,
                });
                updateNotification({
                  title: t("Successful"),
                  message: t("Logged in"),
                  id,
                  loading: false,

                  autoClose: true,
                });
              } catch (e) {
                updateNotification({
                  message: t("An Error occurred"),
                  id,
                  color: "red",
                  loading: false,
                  autoClose: true,
                });
                const { status, message, name, code } = e as {
                  message: string;
                  status: any;
                  code: string;
                  name: string;
                };
                if (code.includes("UserNotConfirmedException")) {
                  setConfirmed(false);
                  setEmail(form.values.email);
                }
                setException({ exception: true, code, message });

                console.error(e);
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
                type="submit"
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                }}
              >
                {t("LogIn")}
              </Button>
            </Box>
          </form>
        )}
        <Group
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <UnstyledButton color="green" component={Link} to="/signup">
              {t("Signup")}
            </UnstyledButton>
            <UnstyledButton
              color="green"
              m={"sm"}
              onClick={async () => {
                const validated = String(form.values.email).match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
                if (!validated) {
                  showNotification({
                    message: t("Not email pattern"),
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
                  throw error;
                }
              }}
            >
              {t("Forgot password")}
            </UnstyledButton>
          </Box>
          <Translation lngs={lngs} />
        </Group>
      </Card>
    </Container>
  );
};
export default LogIn;
