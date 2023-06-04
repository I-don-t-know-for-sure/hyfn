import {
  Accordion,
  Box,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";

import { commonQuestions } from "hyfn-types";
import { t } from "util/i18nextFix";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FooterCentered } from "./components/Footer";

import HtmlRenderer from "components/HtmlReader";
import { useUser } from "contexts/userContext/User";

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = ({}) => {
  const navigate = useNavigate();
  const { loggedIn } = useUser();
  useEffect(() => {
    if (loggedIn) {
      navigate("/home", { replace: true });
    }
  }, [loggedIn]);
  // create a useEffect that checks for changes in the url and if the url has #pricing we should do something
  const { hash } = useLocation();

  const [value, setValue] = useState<null | string>("2");

  console.log("🚀 ~ file: LandingPage.tsx:44 ~ pathname:", hash);
  useEffect(() => {
    // check if pathname has #pricing
    if (hash.includes("#pricing")) {
      setValue("2");
    }
    // check if value is not #pricing and remove #pricing from pathname
    if (value !== "#pricing") {
      window.location.hash = "";
    }
  }, [hash, value]);

  return (
    <Stack
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Card
        sx={{
          backgroundColor: "#E1EDD8",
          color: "black",

          minHeight: "260px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={25}>
          <Box sx={{}}>
            <Text
              // component="h1"
              weight={700}
              size={"6vw"}
              sx={(theme) => ({
                fontFamily: "sans-serif",
                [theme.fn.largerThan("sm")]: {
                  fontSize: "4vw",
                },
                [theme.fn.largerThan("lg")]: {
                  fontSize: "48px",
                },
                [theme.fn.largerThan("md")]: {
                  fontSize: "38px",
                },
              })}
            >
              {t("Order anything for delivery or pickup")}
            </Text>
            <Text size={"2.8vw"}>
              {t(
                "Whatever you want from local stores, brought right to your door"
              )}
            </Text>
          </Box>
          <Stack align="center">
            <Button
              component={Link}
              to={"/signup"}
              sx={{
                borderRadius: "18px",
                width: "40vw",
                maxWidth: "400px",
              }}
            >
              {t("Start shopping")}
            </Button>

            <Text sx={{ display: "flex" }}>
              {t("Have an account already?")}
              <UnstyledButton component={Link} to={"/login"}>
                <Text color="green">{t("Login")}</Text>
              </UnstyledButton>
            </Text>
          </Stack>
        </Stack>
      </Card>

      <Card
        sx={{
          minHeight: "290px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Stack spacing={15}>
          <Box>
            <Text
              weight={700}
              sx={{
                fontFamily: "sans-serif",
                fontSize: "6vw",
                [useMantineTheme().fn.largerThan("lg")]: {
                  fontSize: "4vw",
                },
              }}
            >
              {t("Sell on hyfn")}
            </Text>
            <Text size={"2.8vw"} sx={{ fontFamily: "sans-serif" }}>
              {t(
                "Grow your business and reach new customers by partnering with us"
              )}
            </Text>
          </Box>
          <Stack align="center">
            <Button
              component={Link}
              to={"https://store.hyfn.xyz/signup"}
              target="_blank"
              sx={{
                borderRadius: "18px",
                width: "40vw",
                maxWidth: "400px",
              }}
            >
              {t("Start selling")}
            </Button>
          </Stack>
        </Stack>
      </Card>
      <Stack>
        <Container>
          <Text
            weight={700}
            sx={(theme) => ({
              fontSize: "4.5vw",
              [theme.fn.largerThan("md")]: {
                fontSize: "37px",
              },
            })}
          >
            {t("Common questions")}
          </Text>
        </Container>
        <Group position="center">
          <Accordion
            value={value}
            onChange={setValue}
            sx={(theme) => ({
              width: theme.fn.largerThan("md") ? "70%" : "100%",
            })}
          >
            {commonQuestions.map((commonQuestion, index) => {
              return (
                <Accordion.Item value={`${index}`}>
                  <Accordion.Control>
                    {commonQuestion.question}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <HtmlRenderer htmlString={commonQuestion.answer} />
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </Group>
      </Stack>
      <FooterCentered
        links={[
          {
            label: "Become a partner store",
            link: import.meta.env.VITE_APP_STORE_APP_URL,
          },
          {
            label: "Pricing",
            link: "#pricing",
          },
          {
            label: "Privacy",
            link: "#",
          },
          {
            label: "Terms",
            link: "#",
          },
        ]}
      />
    </Stack>
  );
};

export default LandingPage;
