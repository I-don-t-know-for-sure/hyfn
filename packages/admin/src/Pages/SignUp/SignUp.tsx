import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Group,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId, useLocalStorage } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";

import { t } from "utils/i18nextFix";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext/User";
import { useConfigData } from "../../Components/Menu/config";

const SignUp: React.FC = () => {
  // const { logIn, registerUser, user } = useRealmApp()
  const { signUp, loggedIn, confirmSignUp } = useUser();

  const [storeInfo, setStoreInfo] = useLocalStorage<any>({
    key: "storeInfo",
  });

  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [exception, setException] = useState({
    exception: false,
    message: "",
    code: "",
  });

  const [manualLocation, setManualLocation] = useState(false);
  const err = (e) => {
    alert(e);
  };

  const { lngs } = useConfigData();
  useEffect(() => {
    if (loggedIn) {
      navigate("/", { replace: true });
    }
    // if (user) {
    //   try {
    //     // const { email, password, ...rest } = form.values;
    //     // mutate({ ...rest, id: user?.id });
    //   } catch (e) {
    //     console.error(e)
    //   }
    // }
  }, [loggedIn, navigate]);

  return (
    <Container
      sx={{
        height: "88vh",
        // width: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: 'center',
      }}
    >
      {exception.exception && (
        <Alert title={t("User Already Exists")} color={"red"}>
          {t("An account with this information already exists")}
        </Alert>
      )}
      <Card
        shadow={"md"}
        withBorder
        // sx={{
        //   width: '90%',
        //   maxWidth: 500,
        //   margin: '20px auto',
        // }}
      >
        {signUpSuccess ? (
          <Container
            sx={{
              flexDirection: "column",
              width: "100%",
            }}
            mb={16}
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
            <Button
              fullWidth
              onClick={async () => {
                try {
                  await confirmSignUp({
                    email: form.values.email,
                    code: verificationCode,
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
              }}
            >
              {t("Confirm account")}
            </Button>
          </Container>
        ) : (
          <form
            onSubmit={form.onSubmit(async (values) => {
              const id = randomId();
              try {
                setException({ exception: false, code: "", message: "" });

                const { email, password } = values;
                showNotification({
                  title: t("Signing up"),
                  message: t(""),
                  id,
                  loading: true,
                  autoClose: false,
                });
                const fixedEmail = email.trim();

                // await registerUser(fixedEmail, password)
                await signUp({ email: fixedEmail, password });
                setSignUpSuccess(true);
                setStoreInfo({ email });
                updateNotification({
                  title: t("Signup successful"),
                  message: t("Check your Email for comfirmation"),
                  color: "green",
                  autoClose: false,
                  id,
                });
              } catch (e) {
                console.error(e);
                const { status, message, name, code } = e as {
                  message: string;
                  status: any;
                  code: string;
                  name: string;
                };
                setException({ exception: true, code, message });

                updateNotification({
                  title: t("Error"),
                  message: t("An Error occurred"),
                  color: "red",
                  autoClose: true,
                  id,
                });
              }
            })}
          >
            <TextInput
              type="email"
              required
              label={t("Email")}
              {...form.getInputProps("email")}
            />
            <TextInput
              label={t("Password")}
              type="password"
              required
              {...form.getInputProps("password")}
            />
            <Group grow mt={12}>
              <Button
                type="submit"
                // sx={{
                //   margin: '0px auto',
                //   width: '100%',
                //   maxWidth: '400px',
                //   alignSelf: 'center',
                // }}
              >
                {t("Signup")}
              </Button>
            </Group>
          </form>
        )}
      </Card>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          {t("have an account?")}
          <Link to={"/login"}> {t("login")}</Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
