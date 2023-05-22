import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import React, { useEffect } from "react";
import { useGetPaymentRequests } from "./hooks/useGetPaymentRequests";
import { t } from "utils/i18nextFix";
import { useCreatePaymentRequestObject } from "./hooks/useCreatePaymentRequestObject";
import { useCompletePaymentRequest } from "./hooks/useCompletePaymentRequest";

interface PaymentRequestsProps {}

const PaymentRequests: React.FC<PaymentRequestsProps> = ({}) => {
  const {
    data: paymentRequests,
    isLoading,
    fetchNextPage,
  } = useGetPaymentRequests();
  const {
    mutate: createPaymentRequest,
    isLoading: isCreatingPaymentObject,
    isIdle,
    isSuccess,
    data,
  } = useCreatePaymentRequestObject();
  const { mutate: completePaymentRequest } = useCompletePaymentRequest();
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (!isCreatingPaymentObject && isSuccess && paymentRequests && !isIdle) {
      const { configurationObject } = data;
      console.error(configurationObject);
      const queryString =
        "?" +
        new URLSearchParams({
          ...configurationObject,
          url: `${import.meta.env.VITE_APP_BASE_URL}/completePaymentRequest`,
          colorScheme,
        }).toString();
      window.open(`${import.meta.env.VITE_APP_PAYMENT_APP_URL}` + queryString);
    }
  }, [isCreatingPaymentObject, isSuccess]);

  return (
    <Container
      sx={{
        minHeight: "100vh",
      }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Container mt={12}>
          <Stack>
            {paymentRequests.pages.map((page) => {
              return page.map((paymentRequest) => {
                return (
                  <Paper
                    sx={{
                      maxWidth: "400px",
                    }}
                  >
                    <Stack>
                      <TextInput
                        readOnly
                        variant="unstyled"
                        label={t("Amount")}
                        value={paymentRequest.amount}
                      />

                      <Button
                        onClick={() => {
                          createPaymentRequest({
                            transactionId: paymentRequest._id,
                          });
                        }}
                      >
                        {t("Pay")}
                      </Button>
                      {paymentRequest.transactionDate && (
                        <Button
                          onClick={() => {
                            completePaymentRequest({
                              transactionId: paymentRequest._id,
                            });
                          }}
                        >
                          {t("Validate")}
                        </Button>
                      )}
                    </Stack>
                  </Paper>
                );
              });
            })}
            <Button
              onClick={() => {
                fetchNextPage({
                  pageParam:
                    paymentRequests.pages[paymentRequests.pages.length - 1][
                      paymentRequests.pages[paymentRequests.pages.length - 1]
                        .length - 1
                    ]._id,
                });
              }}
            >
              {t("Load more")}
            </Button>
          </Stack>
        </Container>
      )}
    </Container>
  );
};

export default PaymentRequests;
