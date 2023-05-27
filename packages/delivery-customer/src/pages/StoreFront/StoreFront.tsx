import { Box, Button, Chip, Container, Loader, Text } from "@mantine/core";

import Image from "../../components/Image";

import { useCart } from "../../contexts/cartContext/Provider";

import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useLocation } from "../../contexts/locationContext/LocationContext";

import StoreDetailsModal from "../../components/StoreDetailsModal";

import { useLikeProduct } from "../../pages/Product/hooks/useProduct";

import { useCustomerData } from "../../contexts/customerData/CustomerDataProvider";

import { t } from "../../util/i18nextFix";

import { useGetStoreFront } from "./hooks/useGetStoreFront";
import { useRateStore } from "./hooks/useRateStore";
import Collection from "./components/Collection";

/*

add delivery fees and more information

*/

interface StoreFrontProps {}

const StoreFront: React.FC<StoreFrontProps> = () => {
  const { storefront, city, country } = useParams<{
    storefront: string;
    country: string;
    city: string;
  }>();

  const {
    setCartInfo,
    addProductToCart,
    reduceOrRemoveProductFromCart,
    changeOrderType,
    cart,
  } = useCart();
  const { data, isLoading, isFetched, isError, error } = useGetStoreFront({
    city,
    country,
    storefront,
  });

  const [{ coords }] = useLocation();
  const [distance, setDistance] = useState("0");

  const [inCartStore, setInCartStore] = useState<any>({});

  const [orderType, setOrderType] = useState<"Pickup" | "Delivery">("Delivery");

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below

    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  useEffect(() => {
    if (data && !isLoading && isFetched) {
      const result = getDistanceFromLatLonInKm(
        coords[0],
        coords[1],
        data?.lat,
        data?.long
      );
      const processedResult =
        result < 1
          ? `${result * 1000} ${t("m")}`
          : `${result.toFixed(2)}${t("km")}`;

      setDistance(processedResult);
    }
  }, [isLoading, isFetched, data]);

  useEffect(() => {
    if (isFetched && !isLoading && data) {
      const cartStore = cart[data?.id];

      setInCartStore(cartStore);
      if (typeof cartStore?.orderType === "string") {
        setOrderType(cartStore?.orderType);
      }
    }
  }, [isFetched, isLoading, data, cart]);

  const addedProducts = inCartStore?.addedProducts;

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    <Text>{error as any}</Text>;
  }
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    betweenDesktopAndLarge: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
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

  return (
    data && (
      <Container
        sx={(theme) => ({
          margin: `auto `,
          [theme.fn.largerThan("md")]: {
            margin: `auto `,
          },
        })}
      >
        <Box
          mb={56}
          mt={"23px"}
          style={{
            width: "100%",
          }}
        >
          <>
            <Image
              imageName={data?.image[0]}
              radius={"md"}
              // alt={data.businessName}
              width={"100%"}
              height={"230px"}
              style={{
                margin: " auto",
                alignSelf: "center",
                justifySelf: "center",
              }}
            />
          </>

          <Box>
            <Text weight={700} style={{ fontSize: "34px" }}>
              {data.businessName || data.storeName}
            </Text>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text>{data.description}</Text>
                  <Text m={"auto 2px"}>.</Text>

                  <Text>{`${parseFloat(distance).toFixed(2)} km`}</Text>
                </Box>
                <Text
                  weight={500}
                  sx={{
                    fontSize: "20px",
                    color: data?.opened ? "green" : "red",
                  }}
                >
                  {data?.opened ? t("Open") : t("Closed")}
                </Text>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <StoreDetailsModal storeDetails={data} />
              </Box>
            </Box>
          </Box>
        </Box>
        {data.collections.map((collection) => {
          return (
            <Collection
              key={collection.id}
              collectionName={collection.title}
              orderType={orderType}
              responsive={responsive}
              addedProducts={addedProducts}
              city={city}
              country={country}
              collectionId={collection.id}
              storefront={data}
            />
          );
        })}
      </Container>
    )
  );
};

export default StoreFront;
