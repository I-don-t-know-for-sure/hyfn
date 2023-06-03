import { Box, Text, UnstyledButton } from "hyfn-client";
import Image from "../../components/Image";

import { useLocation } from "../../contexts/locationContext/LocationContext";
import { useSearch } from "../../contexts/searchContext/SearchProvider";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface ExploreProps {}

const Explore: React.FC<ExploreProps> = () => {
  const { hits } = useSearch();
  const [{ country, city }] = useLocation();

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {hits?.length > 0 &&
          hits.map((hit) => (
            <UnstyledButton
              component={Link}
              to={`/${hit.storeId}/${country}/${city}/${hit.id}`}
              sx={(theme) => ({
                height: "34px",

                display: "flex",
                flexDirection: "row",

                ["&:hover"]: {
                  backgroundColor:
                    theme.colorScheme === "light"
                      ? theme.colors.gray[2]
                      : theme.colors.gray[9],
                },
                ...theme.fn.focusStyles(),
              })}
            >
              <Image
                imageName={"2f9d24469885d30addb071001db0cf69"}
                width="30px"
                height="30px"
                m="auto 4px "
                fit="contain"
              />
              <Text
                sx={{
                  margin: "auto 12px ",
                }}
              >
                {hit.title}
              </Text>
            </UnstyledButton>
          ))}
      </Box>
    </Box>
  );
};

export default Explore;
