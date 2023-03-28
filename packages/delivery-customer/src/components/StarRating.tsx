import { Box, Container, UnstyledButton, useMantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { BsFillStarFill } from "react-icons/bs";

interface StarRatingProps {
  onRate: (rating: number) => void;
  customerRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  onRate,
  customerRating = 0,
}) => {
  const [stars, setStars] = useState(new Array(5).fill({}));
  const [rating, setNewRating] = useState(customerRating);
  const theme = useMantineTheme();
  useEffect(() => {
    setStars(
      stars.map((star, index) =>
        customerRating >= index + 1 ? { focus: true } : {}
      )
    );
  }, [customerRating]);
  return (
    <Box
      sx={{
        display: "flex",
        marginTop: 16,
      }}
    >
      {stars.map((star, index) => {
        return (
          <UnstyledButton
            onClick={() => {
              onRate(index + 1);
              setNewRating(index + 1);
              setStars(
                stars.map((star, index) =>
                  rating >= index + 1 ? { focus: true } : {}
                )
              );
            }}
            onMouseEnter={() => {
              setStars(
                stars.map((star, number) =>
                  index >= number ? { focus: true } : {}
                )
              );
            }}
            onMouseLeave={() => {
              setStars(
                stars.map((star, number) => {
                  return rating >= number + 1 ? { focus: true } : {};
                })
              );
            }}
            sx={{
              color: star.focus ? "gold" : theme.colors.gray[4],
            }}
          >
            <BsFillStarFill
              size={26}
              style={{
                marginRight: 5,
              }}
            />
          </UnstyledButton>
        );
      })}
    </Box>
  );
};

export default StarRating;
