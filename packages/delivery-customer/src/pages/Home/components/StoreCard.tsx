import { Box, Card, Text, UnstyledButton } from "@mantine/core";

import Image from "components/Image";

import React from "react";

import { Link } from "react-router-dom";

interface StoreCardProps {
  storeName?: string;
}
const StoreCard: React.FC<any> = ({
  id,
  description,
  businessName,
  storeName,
  image,
  city,
  country,
  ratingCount,
  currentRating,
}) => {
  return (
    <Card
      to={`/${id}/${country}/${city}`}
      component={Link}
      shadow={"lg"}
      sx={(theme) => ({
        margin: " 12px auto ",
        width: "100%",
        minWidth: "290px",
        display: "flex",
        flexDirection: "row",
      })}
    >
      <Image
        imageName={image[0]}
        // sx={(theme) => ({
        //   width: '33%',
        //   height: '33%',
        // })}
        sx={(theme) => ({
          [theme.fn.smallerThan("sm")]: {
            maxWidth: "33%",
            minWidth: "33%",
            maxHeight: "33%",
            minHeight: "33%",
          },
          maxWidth: "66%",
          minWidth: "66%",
          maxHeight: "66%",
          minHeight: "66%",
        })}
        radius={25}
        withPlaceholder
      />
      <Box ml={12}>
        <Text weight={700} size="md" typeof="h1">
          {storeName || businessName}
        </Text>
        <Text variant="text" size="sm">
          {description}
        </Text>
      </Box>
    </Card>
  );
};

export default StoreCard;
