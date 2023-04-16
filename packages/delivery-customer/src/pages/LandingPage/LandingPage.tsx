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
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import { commonQuestions } from "config/constents";
import { t } from "i18next";
import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FooterLinks } from "./components/Footer";
import { useUser } from "contexts/userContext/User";

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = ({}) => {
  // const navigate = useNavigate();
  // const { loggedIn } = useUser();
  // useEffect(() => {
  //   if (loggedIn) {
  //     navigate("/home", { replace: true });
  //   }
  // }, [loggedIn]);

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
              {t("Order anything for delivery or pickup today")}
            </Text>
            <Text size={"2.8vw"}>
              {t(
                "Whatever you want from local stores, brought right to your door"
              )}
            </Text>
          </Box>
          <Stack align="center">
            <Button
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
        }}
      >
        <Stack spacing={15}>
          <Box>
            <Text weight={700} size={"6vw"} sx={{ fontFamily: "sans-serif" }}>
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
        <Accordion>
          {commonQuestions.map((commonQuestion, index) => {
            return (
              <Accordion.Item value={commonQuestion.question + index}>
                <Accordion.Control>{commonQuestion.question}</Accordion.Control>
                <Accordion.Panel>{commonQuestion.answer}</Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Stack>
      <FooterLinks
        data={
          {
            data: [
              {
                title: "About",
                links: [
                  {
                    label: "Features",
                    link: "#",
                  },
                  {
                    label: "Pricing",
                    link: "#",
                  },
                  {
                    label: "Support",
                    link: "#",
                  },
                  {
                    label: "Forums",
                    link: "#",
                  },
                ],
              },
              {
                title: "Project",
                links: [
                  {
                    label: "Contribute",
                    link: "#",
                  },
                  {
                    label: "Media assets",
                    link: "#",
                  },
                  {
                    label: "Changelog",
                    link: "#",
                  },
                  {
                    label: "Releases",
                    link: "#",
                  },
                ],
              },
              {
                title: "Community",
                links: [
                  {
                    label: "Join Discord",
                    link: "#",
                  },
                  {
                    label: "Follow on Twitter",
                    link: "#",
                  },
                  {
                    label: "Email newsletter",
                    link: "#",
                  },
                  {
                    label: "GitHub discussions",
                    link: "#",
                  },
                ],
              },
            ],
          }.data
        }
      />
    </Stack>
  );
};

export default LandingPage;
