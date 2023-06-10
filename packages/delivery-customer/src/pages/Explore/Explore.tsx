import {
  Box,
  Container,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  UnstyledButton
} from "@mantine/core";
import Image from "../../components/Image";
import { useDebouncedState } from "@mantine/hooks";

import { useLocation } from "../../contexts/locationContext/LocationContext";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { useSearch } from "./hooks/useSearch";

interface ExploreProps {}

const Explore: React.FC<ExploreProps> = () => {
  const [{ country, city }] = useLocation();
  const [value, setValue] = useDebouncedState("", 300);
  const { data: hits, isLoading, refetch } = useSearch({ searchValue: value });
  return (
    <Container>
      <Stack>
        <form
          style={{
            width: "100%"
          }}
          onSubmit={(e) => {
            e.preventDefault();
            refetch();
          }}>
          <Group
            position="center"
            mt={12}
            sx={{
              width: "100%"
            }}>
            <TextInput
              sx={{
                width: "100%",
                maxWidth: "500px"
              }}
              placeholder={t("search products, stores")}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </Group>
        </form>
        {isLoading ? (
          <Loader />
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              height: "100%"
            }}>
            {hits?.length > 0 &&
              hits.map((hit) => (
                <UnstyledButton
                  component={Link}
                  to={`${
                    hit?.hasOptions
                      ? `/product/${hit?.storeId}/${country}/${city}/${hit?.id}`
                      : `/product/withnotoptions/${hit.storeId}/${country}/${city}/${hit?.id}`
                  }`}
                  sx={(theme) => ({
                    display: "flex",
                    flexDirection: "row",

                    // marginTop: "3px",
                    // marginBottom: "3px",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    ["&:hover"]: {
                      backgroundColor:
                        theme.colorScheme === "light"
                          ? theme.colors.gray[2]
                          : theme.colors.gray[9]
                    },
                    ...theme.fn.focusStyles()
                  })}>
                  <Group
                    position="apart"
                    sx={{
                      width: "100%"
                    }}>
                    <Flex justify={"flex-start"} align={"center"}>
                      <Image
                        radius={6}
                        imageName={hit.images[0]}
                        width="40px"
                        height="40px"
                        m="auto 4px "
                        fit="contain"
                      />
                      <Text
                        sx={{
                          margin: "auto 12px "
                        }}>
                        {hit.title}
                      </Text>
                    </Flex>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-chevron-right"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2.5"
                      stroke="#00b341"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 6l6 6l-6 6" />
                    </svg>
                  </Group>
                </UnstyledButton>
              ))}
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default Explore;
