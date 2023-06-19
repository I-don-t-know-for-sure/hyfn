import {
  ActionIcon,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  Image,
  Input,
  Loader,
  MultiSelect,
  NumberInput,
  NumberInputHandlers,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";

import { t } from "utils/i18nextFix";
import useGetStoreInfo from "hooks/useGetStoreInfo";
import React, { useEffect, useRef, useState } from "react";

import useUpdateStoreOwnerInfo from "./hooks/useUpdateStoreOwnerInfo";

import LocalCardAPIKey from "./components/LocalCardAPIKey";
import { useDeleteLocalCardAPIKey } from "./hooks/useDeleteLocalCardAPIkey";
import { useAddLocalCardAPIKeys } from "./hooks/useAddLocalCardAPIKey";

import { useForm } from "@mantine/form";
import { useDisableLocalCardKeys } from "./hooks/useDisableLocalCardKeys";
import { useUpdateLocalCardSettings } from "./hooks/useUpdateLocalCardSettings";
import PaymentModal from "./components/PaymentModal";
import { useUpdateSubscription } from "./hooks/useUpdateSubscription";
import { useUpdateOrderSettings } from "./hooks/useUpdateOrderSetting";

import { useAddEmployee } from "./hooks/useAddEmployee";
import { getCountryInfo } from "utils/countryInfo";
import { useUpdateStoreInfo } from "./hooks/useUpdateStoreInfo";
import { storeTypesArray } from "hyfn-types";

interface PaymentsProps {}

// store owner fills their info here and make the monthly payments
// and in the future makes request to get thier money

const Settings: React.FC<PaymentsProps> = () => {
  const {
    data: storeInfo,
    isLoading: isStoreInfoLoading,

    isError,
    error,
    isFetched
  } = useGetStoreInfo();
  const [value, setValue] = useState<number>(0);
  const handlers = useRef<NumberInputHandlers>();

  const { mutate: disableLocalCardKeys } = useDisableLocalCardKeys();
  const { mutate: deleteLocalCardAPIKey } = useDeleteLocalCardAPIKey();
  const { mutate: addLocalCardAPIkey } = useAddLocalCardAPIKeys();
  const { mutate: updateLocalCardSetting } = useUpdateLocalCardSettings();
  const { mutate: updateSubscription } = useUpdateSubscription();
  const { mutate: updateOrderSettings } = useUpdateOrderSettings();
  const paymentForm = useForm({
    initialValues: {
      ownerFirstName: "",
      ownerLastName: "",
      ownerPhoneNumber: "",

      sadadFilled: false,
      sadadApiKey: "",
      MerchantId: "",
      TerminalId: "",
      secretKey: "",
      LocalCardPAIKeyFilled: false,
      includeLocalCardFeeToPrice: false
    }
  });
  useEffect(() => {
    if (storeInfo?.ownerFirstName) {
      paymentForm.setValues({
        ownerFirstName: storeInfo.ownerFirstName,
        ownerLastName: storeInfo.ownerLastName,
        ownerPhoneNumber: storeInfo.ownerPhoneNumber,

        // sadadFilled: data?.sadadFilled,
        // sadadApiKey: data?.sadadApiKey,
        // MerchantId: data?.merchantId,
        // TerminalId: data?.terminalId,
        // secretKey: data?.secretKey,
        includeLocalCardFeeToPrice: storeInfo?.includeLocalCardFeeToPrice,
        LocalCardPAIKeyFilled: !!storeInfo?.localCardApiKeyId
      });
    }
  }, [storeInfo, isStoreInfoLoading]);
  console.log(paymentForm.values.MerchantId);

  // const paymentForm = useForm({
  //   initialValues: {
  //     numberOfMonths: 0,
  //     OTP: "",
  //     customerPhone: "",
  //     birthYear: ""
  //   }
  // });
  const orderSettingsForm = useForm({
    initialValues: {
      acceptDeliveryOrders: true,
      acceptPickupOrders: false
    }
  });
  // create a function that converts a string date to normal date
  const convertDate = (date: string) => {
    const newDate = new Date(date);
    return `${newDate.getFullYear()}-${
      newDate.getMonth() + 1
    }-${newDate.getDate()} `;
  };

  const { mutate: updateStoreOwnerInfo } = useUpdateStoreOwnerInfo();

  const { mutate: addEmployee } = useAddEmployee();
  const [employeeId, setEmployeeId] = useState<string>("");
  const [onlyStoreDriversCanTakeOrders, setOnlyStoreDriversCanTakeOrders] =
    useState(false);
  ////

  const { mutate: updateStoreInfo, isLoading: isMutateLoading } =
    useUpdateStoreInfo();
  const initialInfo = {
    storeType: [],
    storeName: "",
    storePhone: "",

    country: "",
    city: "",
    description: "",
    coords: "",
    address: "",
    image: undefined
  };

  const storeForm = useForm({
    initialValues: initialInfo
  });

  const err = (e) => {
    alert(e);
  };
  const success = (res) => {
    paymentForm.setFieldValue(
      "coords",
      `${res.coords.latitude}, ${res.coords.longitude}`
    );
    //alert(`lat: ${res.coords.latitude}, long: ${res.coords.longitude}`);
    localStorage.setItem("myLocation", JSON.stringify(res));
  };

  useEffect(() => {
    if (!storeInfo) return;
    if (!(Object.keys(storeInfo).length === 0)) {
      const formData = {
        storeName: storeInfo.storeName,
        country: storeInfo.country,
        city: storeInfo.city,
        description: storeInfo.description,
        storeType: storeInfo.storeType,
        storePhone: storeInfo.storePhone,
        coords: `${storeInfo?.lat},${storeInfo?.long}`,
        // coords: "",
        image: storeInfo.image[0],
        address: storeInfo?.address
      };

      storeForm.setValues(formData as any);
      orderSettingsForm.setValues({
        acceptDeliveryOrders: storeInfo.acceptDeliveryOrders,
        acceptPickupOrders: storeInfo.acceptPickupOrders
      });
    }
  }, [isFetched]);

  const { countries, cities } = getCountryInfo();
  ////

  return (
    <Container mt={6}>
      {/* <Helmet>
        <title>{t(isLoading ? 'Loading' : 'Payment Settings')}</title>
      </Helmet> */}
      {isStoreInfoLoading ? (
        <Loader />
      ) : (
        storeInfo && (
          <Stack>
            {/* <StoreInfo /> */}
            <>
              {/* <Helmet>
        <title>{t(isLoading ? 'Loading' : 'Store Info')}</title>
      </Helmet> */}
              {isStoreInfoLoading ? (
                <Loader />
              ) : isError ? (
                <Text>{error as any}</Text>
              ) : (
                storeInfo && (
                  <form
                    onSubmit={paymentForm.onSubmit(async (values) => {
                      updateStoreInfo({
                        ...values,
                        storeInfoFilled: true
                      });
                    })}>
                    <Paper
                    // sx={{
                    //   margin: ' 12px auto ',
                    // }}
                    >
                      <Stack>
                        <TextInput
                          type="text"
                          required
                          label={t("Store Name")}
                          {...storeForm.getInputProps("storeName")}
                        />

                        <TextInput
                          type="text"
                          required
                          label={t(
                            "Descripe what you serve in 4 words at most"
                          )}
                          {...storeForm.getInputProps("description")}
                        />

                        <Group grow>
                          <Input.Wrapper label={t("Store Image")}>
                            <Input
                              type="file"
                              required={!storeInfo.image}
                              onChange={(e) => {
                                storeForm.setFieldValue("imageObj", [
                                  ...e.target.files
                                ]);
                              }}
                            />
                          </Input.Wrapper>
                          {storeInfo.image ? (
                            <Box
                              sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center"
                              }}>
                              <Image
                                width={100}
                                height={100}
                                radius={6}
                                // mt={6}
                                src={`${
                                  import.meta.env.VITE_APP_BUCKET_URL
                                }/preview/${storeInfo.image}`}
                              />
                            </Box>
                          ) : (
                            <Text>{t("no image yet")}</Text>
                          )}
                        </Group>

                        {/* <Paper
              // sx={{
              //   margin: ' 12px auto ',
              // }}
              > */}
                        <Group grow>
                          <TextInput
                            type="number"
                            required
                            label={t("store Phone")}
                            {...storeForm.getInputProps("storePhone")}
                          />
                        </Group>

                        <Group spacing={"sm"} position={"center"} grow={true}>
                          <Select
                            label={t("Country")}
                            data={countries}
                            required
                            aria-label="Country"
                            {...storeForm.getInputProps("country")}
                          />
                          <Select
                            label={t("City")}
                            data={
                              storeForm.values.country
                                ? cities[`${storeForm.values.country}`]
                                : []
                            }
                            required
                            aria-label="City"
                            {...storeForm.getInputProps("city")}
                          />
                        </Group>
                        <Group>
                          <TextInput
                            style={{
                              width: "75%"
                            }}
                            label={t("coords")}
                            {...storeForm.getInputProps("coords")}
                            required
                          />
                          <Button
                            // mt={28}
                            variant="outline"
                            onClick={() => {
                              navigator.geolocation.getCurrentPosition(
                                success,
                                err
                              );
                            }}>
                            {t("current coords")}
                          </Button>
                        </Group>
                        <TextInput
                          label={t("Address")}
                          {...storeForm.getInputProps("address")}
                        />
                        <MultiSelect
                          label={t("Store Type")}
                          required
                          data={storeTypesArray.map((type) => {
                            return { label: t(type), value: type };
                          })}
                          aria-label="Store Type"
                          onChange={(e) => {
                            if (e.includes("restaurant")) {
                              storeForm.setFieldValue("storeType", [
                                "restaurant"
                              ]);
                              return;
                            }
                            storeForm.setFieldValue("storeType", e);
                          }}
                          value={storeForm.values.storeType}
                        />
                        <Group
                          sx={{
                            display: "flex",
                            flexDirection: "row-reverse"
                          }}>
                          <Button
                            disabled={isMutateLoading}
                            fullWidth
                            // sx={{
                            //   maxWidth: '450px',
                            // }}
                            // m={'0px auto'}
                            type="submit">
                            {t("Update Store Info")}
                          </Button>
                        </Group>
                      </Stack>
                    </Paper>
                  </form>
                )
              )}
            </>
            <Card title={t("Owner Info")}>
              <Text size="md" weight={500}>
                {t("Owner Info")}
              </Text>
              <form
                onSubmit={paymentForm.onSubmit((values) => {
                  updateStoreOwnerInfo({
                    ...values,
                    storeOwnerInfoFilled: true
                  });
                })}>
                <Group grow>
                  <TextInput
                    required
                    label={t("first name")}
                    {...paymentForm.getInputProps("ownerFirstName")}
                  />
                  <TextInput
                    required
                    label={t("last name")}
                    {...paymentForm.getInputProps("ownerLastName")}
                  />
                </Group>
                <TextInput
                  required
                  label={t("phone number")}
                  {...paymentForm.getInputProps("ownerPhoneNumber")}
                />

                <Container
                  mt={14}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end"
                  }}>
                  <Button
                    // m={'0px auto'}
                    fullWidth
                    // sx={{
                    //   maxWidth: '450px',
                    // }}
                    type="submit">
                    {t("update")}
                  </Button>
                </Container>
              </form>
            </Card>

            <LocalCardAPIKey
              MerchantId={paymentForm.values.MerchantId}
              TerminalId={paymentForm.values.TerminalId}
              localCardAPIKeyFilled={paymentForm.values.LocalCardPAIKeyFilled}
              secretKey={paymentForm.values.secretKey}
              includeLocalCardFeeToPrice={
                paymentForm.values.includeLocalCardFeeToPrice
              }
              addLocalCardAPIkey={addLocalCardAPIkey}
              deleteLocalCardAPIKey={deleteLocalCardAPIKey}
              disableLocalCardAPIKeys={disableLocalCardKeys}
              updateLocalCardSetting={updateLocalCardSetting}
            />

            <Card
              // m={'12px auto'}
              title={t("Account Payments")}
              shadow={"md"}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                <Title order={3} mb={8}>
                  {t("Account Payments")}
                </Title>
                <PaymentModal balance={storeInfo?.balance} />
              </Box>

              <Stack align="center">
                <Group>
                  <Text>
                    {`${t("Started at")} ${
                      storeInfo?.timeOfPayment
                        ? convertDate(storeInfo?.timeOfPayment as any)
                        : Number.NaN
                    }`}
                  </Text>
                  <Text>
                    {`${t("Ends at")} ${
                      storeInfo?.expirationDate
                        ? convertDate(storeInfo?.expirationDate as any)
                        : Number.NaN
                    }`}
                  </Text>
                </Group>
                <Group spacing={5}>
                  <ActionIcon
                    size={42}
                    variant="default"
                    onClick={() => handlers.current.decrement()}>
                    –
                  </ActionIcon>

                  <NumberInput
                    hideControls
                    value={value}
                    onChange={(val) => setValue(val as number)}
                    handlersRef={handlers}
                    // max={10}
                    min={1}
                    step={1}
                    styles={{ input: { width: 54, textAlign: "center" } }}
                  />

                  <ActionIcon
                    size={42}
                    variant="default"
                    onClick={() => handlers.current.increment()}>
                    +
                  </ActionIcon>
                </Group>
                <Button
                  onClick={() => {
                    updateSubscription({ numberOfMonths: value });
                  }}>
                  {t("Update subscription")}
                </Button>
              </Stack>
            </Card>
            <Card>
              <Title order={3}>{t("Order Settings")}</Title>
              <form
                onSubmit={orderSettingsForm.onSubmit((values) => {
                  updateOrderSettings({
                    acceptDeliveryOrders: values.acceptDeliveryOrders,
                    acceptPickupOrders: values.acceptPickupOrders
                  });
                })}>
                <Group mt={8}>
                  <Checkbox
                    label={t("Accept Delivery Orders")}
                    {...orderSettingsForm.getInputProps(
                      "acceptDeliveryOrders",
                      { type: "checkbox" }
                    )}
                  />
                  <Checkbox
                    label={t("Accept Pickup Orders")}
                    {...orderSettingsForm.getInputProps("acceptPickupOrders", {
                      type: "checkbox"
                    })}
                  />
                </Group>
                <Button mt={12} type="submit" fullWidth>
                  {t("Update")}
                </Button>
              </form>
            </Card>
            {/* <Employees /> */}
            <Card>
              <Stack>
                <TextInput
                  label={t("Add employee")}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
                <Button
                  onClick={() => {
                    addEmployee({ employeeId });
                  }}>
                  {t("Add employee")}
                </Button>
              </Stack>
            </Card>
          </Stack>
        )
      )}
    </Container>
  );
};

export default Settings;
