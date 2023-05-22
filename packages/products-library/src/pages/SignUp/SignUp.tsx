import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Group,
  MultiSelect,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId, useLocalStorage } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useConfigData } from "components/Menu/config";

import Translation from "components/Translation";
import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { getCountryInfo } from "utils/countryInfo";

const SignUp: React.FC = () => {
  const { signUp, loggedIn, confirmSignUp } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [companyInfo, setCompanyInfo] = useLocalStorage<any>({
    key: "companyInfo",
  });
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",

      agreeToTermsofService: false,
    },
  });
  const [, setManualLocation] = useState(false);
  const [exception, setException] = useState({
    exception: false,
    message: "",
    code: "",
  });

  const { lngs } = useConfigData();
  useEffect(() => {
    if (loggedIn) {
      navigate("/", { replace: true });
    }
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
        withBorder
        sx={{
          width: "90%",
          maxWidth: 500,
          margin: "20px auto",
        }}
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { email, password, ...rest } = values;
                showNotification({
                  title: t("Signing up"),
                  message: t(""),
                  id,
                  loading: true,
                  autoClose: false,
                });
                const fixedEmail = values.email.trim();
                await signUp({ email: fixedEmail, password });
                setSignUpSuccess(true);
                // await registerUser(fixedEmail, values.password);
                updateNotification({
                  title: t("Signup successful"),
                  message: t("Check your Email for comfirmation"),
                  color: "green",
                  autoClose: false,
                  id,
                });
                setCompanyInfo({ ...rest, email });
              } catch (e) {
                const { status, message, name, code } = e as {
                  message: string;
                  status: any;
                  code: string;
                  name: string;
                };

                setException({ exception: true, code, message });
                updateNotification({
                  message: t("An Error occurred"),
                  id,
                  color: "red",
                  loading: false,
                  autoClose: true,
                });
                console.error(e);
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
                sx={{
                  margin: "0px auto",
                  width: "100%",
                  maxWidth: "400px",
                  alignSelf: "center",
                }}
              >
                {t("Signup")}
              </Button>
            </Group>
          </form>
        )}
        <Box
          mt={10}
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
          <Translation lngs={lngs} />
        </Box>
      </Card>
    </Container>
  );
};

export default SignUp;
