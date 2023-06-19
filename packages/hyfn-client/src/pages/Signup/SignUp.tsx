import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Group,
  TextInput
} from "@mantine/core";
import { randomId, useLocalStorage } from "@mantine/hooks";
import React from "react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Translation from "../../components/Translation";

import { lngs } from "hyfn-types";
import { useUser } from "../../context/User";

import { showNotification, updateNotification } from "@mantine/notifications";

import { useForm } from "@mantine/form";

export const SignUp: React.FC = () => {
  // const { registerUser, user } = useRealmApp();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signUp, confirmSignUp, userId, loggedIn, resendConfirmationEmail } =
    useUser();
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [exception, setException] = useState({
    exception: false,
    message: "",
    code: ""
  });

  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useLocalStorage<any>({
    key: "customerInfo"
  });

  const form = useForm({
    initialValues: {
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    if (loggedIn) {
      navigate("/home", { replace: true });
    }
  }, [loggedIn, navigate]);

  return (
    <Container
      sx={{
        height: "88vh",
        // width: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
        // alignItems: 'center',
      }}>
      {exception.exception && (
        <Alert title={t("User Already Exists") as any} color={"red"}>
          {t("An account with this information already exists") as any}
        </Alert>
      )}
      <Card
        shadow={"md"}
        m={" auto"}
        sx={{
          width: "380px"
          // alignSelf: 'center',
          // justifySelf: 'center',
        }}>
        {signUpSuccess ? (
          <Container
            sx={{
              flexDirection: "column",
              width: "100%"
            }}
            mb={16}>
            <TextInput
              mb={16}
              sx={{ width: "100%" }}
              label={t("Confirmation code") as any}
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
              }}
            />
            <Button
              fullWidth
              onClick={async () => {
                try {
                  await confirmSignUp({
                    email: form.values.email,
                    code: verificationCode
                  });
                  navigate("/login", { replace: true });
                  showNotification({
                    message: t("You can sign in now"),
                    color: "green",
                    autoClose: true,
                    title: t("Sign up successful")
                  });
                } catch (error) {
                  const { status, message, name, code } = error as {
                    message: string;
                    status: any;
                    code: string;
                    name: string;
                  };
                  setException({ exception: true, code, message });

                  console.error(error);
                }
              }}>
              {t("Confirm account") as any}
            </Button>
          </Container>
        ) : (
          <form
            onSubmit={form.onSubmit(async (values) => {
              const id = randomId();
              try {
                setException({ exception: false, code: "", message: "" });

                showNotification({
                  title: "",
                  message: "",
                  loading: true,
                  autoClose: false,
                  id
                });
                const { email, password, ...rest } = values;
                const trimmedEmail = values.email.trim();
                await signUp({
                  email: trimmedEmail,
                  password: values.password
                });
                setSignUpSuccess(true);
                setCustomerInfo({ email, ...rest });
                updateNotification({
                  title: "",
                  message: "",
                  color: "green",
                  loading: false,
                  autoClose: false,
                  id
                });
              } catch (e) {
                const { status, message, name, code } = e as {
                  message: string;
                  status: any;
                  code: string;
                  name: string;
                };

                console.log("already in use");
                setException({ exception: true, code, message });

                updateNotification({
                  title: t("An Error  occurred"),
                  message: t("Error") as any,
                  color: "red",
                  loading: false,
                  autoClose: true,
                  id
                });
                console.error(e);
              }
            })}>
            <TextInput
              type="email"
              required
              label={t("Email") as any}
              {...form.getInputProps("email")}
            />
            <TextInput
              label={t("Password") as any}
              type="password"
              {...form.getInputProps("password")}
            />
            <Button fullWidth mt={16} type="submit">
              {t("Signup") as any}
            </Button>{" "}
          </form>
        )}
        <Box
          sx={{
            margin: "16px auto 6px auto",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "baseline"
          }}>
          <Box>
            {t("have an account?") as any} <Link to="/login">{t("Login")}</Link>
          </Box>
          <Translation lngs={lngs} />
        </Box>
      </Card>
    </Container>
  );
};
