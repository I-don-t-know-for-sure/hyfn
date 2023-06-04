import { Box, Container, Paper, Text, useMantineTheme } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
interface ProductControlerProps {
  qty?: number;
  addproduct?: () => void;
  reduceOrRemoveProduct?: () => void;
}

const ProductControler: React.FC<ProductControlerProps> = ({
  qty,
  addproduct,
  reduceOrRemoveProduct,
}) => {
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));
  useEffect(() => {
    if (qty === 0 || qty < 1 || qty === undefined) {
      setOpened(false);
    }
  }, [qty]);
  const theme = useMantineTheme();
  return (
    <Container
      onClick={() => setOpened(true)}
      style={{
        zIndex: 9999,
        width: "14px",
        marginRight: opened ? "75px" : "0px",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {opened ? (
        <Paper
          ref={ref}
          sx={(theme) => ({
            zIndex: 9999,
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            margin: "auto",
            borderRadius: "20px",
            backgroundColor:
              theme.colorScheme === "light" ? theme.white : theme.black,
            width: "108px",
            height: "30px",
            justifyContent: "space-around",
            alignItems: "center",
          })}
        >
          {qty > 1 ? (
            <AiOutlineMinus size={22} onClick={reduceOrRemoveProduct} />
          ) : (
            <BsFillTrashFill size={22} onClick={reduceOrRemoveProduct} />
          )}

          <Text
            sx={(theme) => ({
              color: theme.primaryColor,
              margin: "0px auto",
              fontSize: "22px",
            })}
          >
            {qty > 0 ? qty : 0}
          </Text>

          <AiOutlinePlus
            style={{
              color: theme.colorScheme === "light" ? theme.black : theme.white,
            }}
            size={22}
            onClick={addproduct}
          />
        </Paper>
      ) : (
        <Paper
          shadow={"lg"}
          sx={(theme) => ({
            display: "flex",
            zIndex: 9999,

            flexDirection: "row",
            margin: "auto",
            borderRadius: "50%",
            backgroundColor:
              theme.colorScheme === "light" ? theme.white : theme.black,

            width: "26px",
            height: "26px",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          {qty > 0 ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                sx={(theme) => ({
                  color: theme.primaryColor,
                })}
                m={"0px auto"}
              >
                {qty}
              </Text>
            </Box>
          ) : (
            <AiOutlinePlus
              style={{
                margin: "0px auto",
                color:
                  theme.colorScheme === "light" ? theme.black : theme.white,
              }}
              size={22}
              onClick={addproduct}
            />
          )}
        </Paper>
      )}
    </Container>
  );
};

export default ProductControler;
