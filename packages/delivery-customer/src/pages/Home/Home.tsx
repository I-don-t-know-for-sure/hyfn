import {
  Box,
  Button,
  Center,
  Chip,
  Container,
  Group,
  Loader,
  LoadingOverlay,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { Store } from "config/types";
import React, { useEffect, useState } from "react";
import StoreCard from "./components/StoreCard";
import useGetStores from "./hooks/useGetStores";

import { Carousel } from "@mantine/carousel";

import useHomeConfig from "./config";
import { test2 } from "hyfn-types";
import { t } from "../../util/i18nextFix";

import { useLocation } from "../../contexts/locationContext/LocationContext";
import { z } from "zod";
import { useSendNotification } from "./hooks/useSendNotification";

// yarn add https://github.com/MyOrg/my-lib.git#branch

const Home: React.FC = () => {
  console.log("🚀 ~ file: Home.tsx:11 ~ test2:", test2);

  const [filter, setFilter] = useState("all");
  const [nearby, setNearby] = useState(false);
  const [{ city }] = useLocation();
  const { data, isLoading, isError, error, isFetched, fetchNextPage } =
    useGetStores({
      filter,
      nearby,
      city,
    });
  const { mutate } = useSendNotification();
  // useEffect(() => {
  //   console.log(
  //     window.innerHeight + window.scrollY >= document.body.offsetHeight
  //   );

  //   if (
  //     window.innerHeight + window.scrollY >= document.body.offsetHeight &&
  //     Array.isArray(data?.pages)
  //   ) {
  //     fetchNextPage({ pageParam: data.pages[data.pages.length - 1][]?._id });
  //     console.log(data.pages[data.pages.length - 1][19]?._id);
  //   }
  // }, [scroll]);
  // console.log(convertZodToJSONSchema(productSchema as any));

  const projection = {};

  // type productType = z.infer<typeof schema>;

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 7,
    },
    betweenDesktopAndLarge: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },

    tablet: {
      breakpoint: { max: 1025, min: 700 },
      items: 4.5,
    },
    notMobileNotTablet: {
      breakpoint: { max: 670, min: 464 },
      items: 3.2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2.5,
    },
  };
  const sections = useHomeConfig();

  return (
    <Box
      sx={{
        margin: "auto ",
        width: "100%",
      }}
    >
      <Carousel align={"start"} slideSize={"20%"}>
        {sections.map((section) => {
          return (
            <Carousel.Slide key={section.value}>
              <Box
                mt={24}
                mb={24}
                sx={{
                  width: "100%",
                }}
              >
                <Chip
                  onClick={() => {
                    if (filter === section.value) {
                      setFilter("all");
                    } else {
                      setFilter(section.value);
                    }
                  }}
                  checked={filter === section.value}
                  sx={{
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignContent: "center",

                    width: "fit-content",
                  }}
                >
                  {t(section.label)}
                </Chip>
              </Box>
            </Carousel.Slide>
          );
        })}
      </Carousel>

      {isError ? (
        <Text>{error as any}</Text>
      ) : isLoading ? (
        <Loader />
      ) : (
        isFetched && (
          <Container sx={{}}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                weight={500}
                sx={{
                  fontSize: 28,
                }}
              >
                {t("Results")}
              </Text>
              <Group>
                <Button variant="light" onClick={() => setNearby(!nearby)}>
                  {t("Nearby")}
                </Button>
                <Button
                  variant="light"
                  onClick={() => {
                    setNearby(false);
                    setFilter("all");
                  }}
                >
                  {t("Reset")}
                </Button>
              </Group>
            </Container>
            <SimpleGrid
              sx={(theme) => ({
                width: "100%",

                [theme.fn.largerThan("md")]: {
                  gridTemplateColumns: "repeat(2, 1fr)",
                },
                [theme.fn.largerThan("lg")]: {
                  gridTemplateColumns: "repeat(3, 1fr)",
                },
                [theme.fn.smallerThan("md")]: {
                  gridTemplateColumns: "repeat(2, 1fr)",
                },
                [theme.fn.smallerThan("sm")]: {
                  gridTemplateColumns: "repeat(1, 1fr)",
                },
                [theme.fn.smallerThan("xs")]: {
                  gridTemplateColumns: "repeat(1, 1fr)",
                },
                // display: "flex",
                // flexWrap: "wrap",
                // justifyContent: "space-between",
              })}
              cols={3}
              breakpoints={[
                {
                  maxWidth: "lg",
                  cols: 2,
                  spacing: "md",
                },
                {
                  maxWidth: "md",
                  cols: 2,
                  spacing: "sm",
                },
                {
                  maxWidth: "sm",
                  cols: 3,
                  spacing: "md",
                },
              ]}
            >
              {data.pages.map((page) => {
                return page?.map((store: Store) => {
                  if (store._id.toString() === "collectionInfo") {
                    return;
                  }
                  return <StoreCard {...store} />;
                });
              })}
            </SimpleGrid>
            <Center m={"12px auto"}>
              <Button
                sx={{
                  width: "100%",
                  maxWidth: "450px",
                }}
                onClick={() =>
                  fetchNextPage({
                    pageParam:
                      data?.pages[data?.pages?.length - 1][
                        data?.pages[data.pages?.length - 1]?.length - 1
                      ]?._id,
                  })
                }
              >
                {t("More")}
              </Button>
            </Center>
          </Container>
        )
      )}
      <Button
        onClick={() => {
          mutate();
        }}
      >
        {t("test")}
      </Button>
    </Box>
  );
};

export default Home;
