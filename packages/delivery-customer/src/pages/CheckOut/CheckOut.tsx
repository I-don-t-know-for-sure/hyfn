import {
  Accordion,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Select,
  Skeleton,
  Text,
  TextInput
} from "@mantine/core";

import "dayjs/locale/ru";
import { useForm } from "@mantine/form";
import React, { forwardRef, useEffect, useState } from "react";
import { GoLocation } from "react-icons/go";
import { BsCreditCardFill } from "react-icons/bs";

import { useCart } from "../../contexts/cartContext/Provider";

import { useLocation } from "../../contexts/locationContext/LocationContext";

import { t } from "../../util/i18nextFix";
import { paymentMethods } from "../../config/data";

import { useCreateOrderData } from "./hooks/useCreateOrderdata";

import { convertObjectToArray } from "./utils/convertObjectToArray";

import { DatePickerInput, DateTimePicker } from "@mantine/dates";

import { convertCoordsArraytoString } from "../../util/convertCoordsArrayToString";
import { convertCoordsStringToArray } from "../../util/convertCoordsString.Array";
import { useGetUserDocument } from "../../hooks/useGetUserDocument";

import { useUser } from "../../contexts/userContext/User";

import {
  allCitiesForSelect,
  orderTypesObject,
  storeAndCustomerServiceFee
} from "hyfn-types";
import { useNavigate, useLocation as useRouteLocation } from "react-router-dom";

import { calculateOrderCost } from "util/calculateOrderCost";
import { add, multiply } from "mathjs";
import { baseServiceFee } from "hyfn-types";

interface CheckOutProps {}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);

const CheckOut: React.FC<CheckOutProps> = () => {
  const routeLocation = useRouteLocation();
  const [state, setState] = useState<string | null>(null);

  const { cart } = useCart();

  const [cartArray, setCartArray] = useState([]);
  useEffect(() => {
    const array = convertObjectToArray(cart);

    // we will have only one store per order so we will find the store that
    // the customer wants to order from based on what they clicked on in the cart page
    if (!routeLocation?.state?.storeId) {
      navigate("/cart", { replace: true });
      return;
    }
    const storeToOrderFrom = array.find((store) => {
      return store.id === routeLocation?.state?.storeId;
    });
    setCurrency(storeToOrderFrom.currency);
    setCartArray([storeToOrderFrom]);
  }, [cart]);
  const orderCost = calculateOrderCost(cartArray);
  const serviceFee = parseFloat(
    add(multiply(orderCost, storeAndCustomerServiceFee), baseServiceFee) as any
  ).toFixed(2);
  const totalCost = add(orderCost, serviceFee);
  const [deliveryDate, setDeliveryDate] = useState(
    (() => {
      const now = new Date();

      now.setHours(new Date().getHours() + 1);
      return now;
    })()
  );
  const [orderType, setOrderType] = useState(orderTypesObject.Delivery);
  const [currency, setCurrency] = useState("LYD");
  const { userId } = useUser();
  const {
    data: userCustomData,
    isLoading: isUserDocumentLoading,
    refetch
  } = useGetUserDocument({ userId });

  useEffect(() => {
    if (typeof cart[routeLocation?.state?.storeId] === "object") {
      setOrderType(cart[routeLocation?.state?.storeId]?.orderType);
    }
  }, [cart, routeLocation]);

  const [, setManualLocation] = useState(false);
  // const balance = userCustomData?.balance;
  const [{ coords: userCoords, country, city }, setLocation] = useLocation();
  const [{ distance, duration, deliveryFee }, setDeliveryDetails] =
    useState<any>({
      distance: 0,
      duration: 0
    });

  const initialValues = {
    location: `${userCoords[0]},${userCoords[1]}`,
    address: "",
    phoneNumber: "",
    country,
    city
  } as {
    location: string | number[];
    address: string;
    phoneNumber: string;
    country: string;
    city: string;
  };
  const form = useForm({
    initialValues
  });
  const navigate = useNavigate();
  const [error, setError] = useState({ error: false, message: "" });
  const [addressKey, setAddressKey] = useState("");
  const addresses = userCustomData?.addresses as any[];
  // const customerBalanceIsSuffictient = serviceFee < balance;
  const selectAddresses = addresses?.map((address) => {
    return {
      label: address?.label,
      value: address?.key
    };
  });

  // usePayWithLocalCard(paymentMethod === 'localCard');

  /* come up with a way to calculate delivery prices */

  const [orderChanged, setOrderChanged] = useState(false);
  const { mutate, data, isLoading, isIdle, isSuccess } = useCreateOrderData();

  // const { mutate: createOrderMutation } = useCreateOrder();
  // const coords = getStoresCoords(cart);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);
  useEffect(() => {
    if (addressKey) {
      const address = addresses.find(({ key }) => {
        return key === addressKey;
      });

      if (address) {
        form.setValues({
          address: address.locationDescription,
          location: convertCoordsArraytoString(address.coords),
          phoneNumber: form.values.phoneNumber,
          city: address.city,
          country: address.country
        });
      }
    }
  }, [addressKey]);
  // const { refetch: refetchGetDriverManagements } = useGetDriverManagements({});
  // const requestHandler = () => {
  //   // const doesOrderExist = userCustomData.order;

  //   if (doesOrderExist) {
  //     // const { orders: userOrderCart } = userCustomData.order as {
  //     //   orders: any;
  //     // };

  //     const change = Object.keys(cart).some((cartStoreId) => {
  //       const cartStore = cart[cartStoreId];
  //       const userStore = userOrderCart[cartStore.id];
  //       if (!userStore) {
  //         return true;
  //       }

  //       Object.keys(cartStore.addedProducts).some((cartProductId) => {
  //         const cartProduct = cartStore.addedProducts[cartProductId];
  //         const userProduct = userStore.addedProducts[cartProduct.id];
  //         if (!userProduct) {
  //           return true;
  //         }

  //         return false;
  //       });
  //       return false;
  //     });

  //     if (change) {
  //       mutate({ cart: cartArray, deliveryDate: deliveryDate.getTime() });
  //       setOrderChanged(true);
  //     } else {
  //       // const { deliveryDetails } = userCustomData.order as {
  //       //   deliveryDetails: { distance: number; duration: number };
  //       // };
  //       setDeliveryDetails(userCustomData.order);
  //     }
  //   } else {
  //     mutate({ cart: cartArray, deliveryDate });
  //   }
  // };

  useEffect(() => {
    if (!isLoading && orderChanged) {
      refetch();
    }
  }, [isLoading, data, orderChanged]);

  // useEffect(() => {
  //   if (
  //     !isLoading &&
  //     !isUserDocumentLoading &&
  //     typeof userCustomData.order === "object"
  //   ) {
  //     // const { deliveryDetails } = userCustomData.order as { deliveryDetails: any };
  //     setDeliveryDetails(userCustomData.order);
  //   }
  // }, [orderChanged, isLoading, data, userCustomData, isUserDocumentLoading]);

  const err = (e) => {
    alert(e);
  };
  const success = (res) => {
    form.setFieldValue(
      "location",
      `${res.coords.latitude}, ${res.coords.longitude}`
    );
    setLocation((prev) => {
      return {
        city: prev.city,
        country: prev.country,
        coords: [res.coords.latitude, res.coords.longitude],
        address: prev.address
      };
    });
    //alert(`lat: ${res.coords.latitude}, long: ${res.coords.longitude}`);
  };

  return (
    <Container>
      <Accordion value={state} onChange={setState}>
        <Accordion.Item value="location">
          <Accordion.Control icon={<GoLocation />}>
            {t("Delivery Location")}
          </Accordion.Control>
          <Accordion.Panel>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexFlow: "wrap",
                width: "100%"
              }}>
              <form
                style={{
                  width: "100%"
                }}>
                <Button
                  type="button"
                  variant="outline"
                  style={{
                    width: "100%"
                  }}
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(success, err);
                  }}>
                  {t("set your current location")}
                </Button>
                <Group
                  sx={{
                    width: "100%"
                  }}>
                  <TextInput
                    sx={{
                      width: "62%"
                    }}
                    label={t("Location")}
                    style={{
                      marginTop: "12px",
                      flexGrow: 0.9
                    }}
                    onBlur={(e) => {
                      const coords = convertCoordsStringToArray(e.target.value);
                      console.log(
                        "🚀 ~ file: CheckOut.tsx:267 ~ coords",
                        coords
                      );
                      if (coords.length !== 2) {
                        setError({ error: true, message: "wrong syntax" });
                      }
                      form.setFieldValue("location", coords);

                      setError({ error: false, message: "wrong syntax" });
                    }}
                    error={error.error}
                    placeholder={"32.4343, 13.545"}
                    required
                    value={convertCoordsArraytoString(form.values.location)}
                    onChange={(e) => {
                      form.setFieldValue("location", e.currentTarget.value);
                      setManualLocation(true);
                    }}
                  />
                  <Select
                    label={t("Addresses")}
                    sx={{
                      marginTop: "12px",
                      maxWidth: "33%"
                    }}
                    data={selectAddresses || []}
                    value={addressKey}
                    onChange={(e) => {
                      setAddressKey(e);
                    }}
                  />
                </Group>
                <TextInput
                  sx={{
                    width: "100%"
                  }}
                  label={t("Location details")}
                  {...form.getInputProps("address")}
                />
                <Select
                  title={t("City")}
                  data={allCitiesForSelect["Libya"]}
                  {...form.getInputProps("city")}
                />
                <TextInput
                  type="tel"
                  required
                  label={t(
                    "phone number you want to be contacted on with the delivery driver and the store"
                  )}
                  {...form.getInputProps("phoneNumber")}
                  placeholder={"0912345678"}
                />
                <DateTimePicker
                  required
                  value={deliveryDate}
                  onChange={(e) => {
                    if (new Date() < e) {
                      setDeliveryDate(e);
                    }
                    console.log("🚀 ~ file: CheckOut.tsx:551 ~ e:", e);
                  }}
                  label={t("Pick Date")}
                />
              </form>
            </Box>

            <Group position="right" mt="xl">
              <Button
                type="button"
                onClick={() => setState("delivery company")}>
                {t("Next step")}
              </Button>
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="delivery company">
          <Accordion.Control>{t("Delivery company")}</Accordion.Control>
          <Accordion.Panel>
            <Group position="apart" mt="xl">
              <Button type="button" onClick={() => setState("location")}>
                {t("Previous")}
              </Button>
              <Button type="button" onClick={() => setState("")}>
                {t("Next step")}
              </Button>
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Box mt={16}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}>
          <Text>{t("Subtotal")}</Text>
          <Text>{`${currency || "LYD"} ${orderCost}`}</Text>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}>
          <Text>{t("Service fee")}</Text>
          <Text>{`${currency || "LYD"} ${serviceFee}`}</Text>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6
          }}>
          <Text weight={600}>{t("Total")}</Text>
          <Text>{`${currency || "LYD"} ${totalCost}`}</Text>
        </Box>
      </Box>

      <Button
        // disabled={}
        style={{
          width: "100%",
          marginTop: "16px"
        }}
        onClick={() => {
          try {
            setLocation((prev) => {
              const { location: coordinates, address } = form.values;
              if (typeof coordinates !== "string") {
                return {
                  city: prev.city,
                  country: prev.country,
                  coords: coordinates,
                  address: prev.address
                };
              }
              const proccessed = coordinates.split(",");

              return {
                city: prev.city,
                country: prev.country,
                coords: [parseFloat(proccessed[0]), parseFloat(proccessed[1])],
                address: address
              };
            });
            mutate({ cart: cartArray, deliveryDate: deliveryDate.getTime() });
          } catch (e) {
            console.error(e);
          }
        }}>
        {t("Place Order")}
      </Button>
    </Container>
  );
};

export default CheckOut;
