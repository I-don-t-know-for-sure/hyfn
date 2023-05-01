import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  CloseButton,
  Container,
  Group,
  Image,
  LoadingOverlay,
  Table,
  Text,
} from "@mantine/core";
import { useRefreshOrderDocument } from "../hooks/useRefreshOrderDocument";
import TransactionModal from "./TransactionModal";
import DriverInfoModal from "./DriverInfoModal";
import OptionsModal from "./OptionsModal";
import {
  ORDER_TYPE_DELIVERY,
  STORE_STATUS_READY,
  STORE_TYPE_RESTAURANT,
} from "hyfn-types";
import { t } from "utils/i18nextFix";
import InstructionsModal from "./InstructionsModak";
import SetProductAsInactiveButton from "./setProductAsInactive";
import ImageModal from "components/ImageModal";
import ControlButton from "./ControlButton";
import { useSetProductAsPickedUp } from "../hooks/useSetProductAsPickedUp";
import { useSetProductAsNotFound } from "../hooks/useSetProductAsNotFound";
import DeliveryConfirmationModal from "components/DeliverConfirmationModal";

export function ActiveOrder({
  isLoading,
  order,
  validateTransaction,
  storeOrder,
  driver,
  userDocument,
  updateProductState,
  rejectOrder,
  setOrderAsPreparing,
  setOrderAsReady,
  setOrderAsDelivered,
  setOrderAsAccepted,
  status,
}: {
  isLoading: boolean;
  order: any;
  validateTransaction;
  storeOrder: any;
  driver: any;
  userDocument: any;
  setOrderAsDelivered: ({ orderId }: { orderId: string }) => void;
  updateProductState;
  rejectOrder;
  setOrderAsPreparing?;
  setOrderAsReady?;
  setOrderAsAccepted?: any;
  status?: string;
}) {
  console.log("🚀 ~ file: ActiveOrder.tsx:57 ~ status:", status);
  const { refetch, isLoading: isRefreshOrderLoading } = useRefreshOrderDocument(
    { orderId: order._id.toString() }
  );
  const { mutate: setProductAsPickedUp } = useSetProductAsPickedUp();
  const { mutate: setProductAsNotFound } = useSetProductAsNotFound();
  return (
    <Container>
      <Card mt={8}>
        <LoadingOverlay
          visible={isLoading}
          sx={{
            width: "100%",
            height: "100%",
          }}
        />
        <Group position="right">
          {storeOrder.paid ? (
            <Badge color={"green"}>{t("Order paid")}</Badge>
          ) : (
            <Badge color={"red"}>{t("Order not paid")}</Badge>
          )}

          <ActionIcon
            onClick={() => {
              refetch();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-refresh"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
            </svg>
          </ActionIcon>

          <CloseButton
            onClick={() => {
              setOrderAsDelivered({ orderId: order?._id?.toString() });
            }}
            aria-label="set to delivered"
          />
        </Group>
        <Group position="apart">
          <Text>{order._id.toString()}</Text>
        </Group>
        <Group>
          {Array.isArray(order.transactions) && (
            <TransactionModal
              validateTransaction={validateTransaction}
              transactions={storeOrder.transactions}
              storeProducts={storeOrder.addedProducts}
            />
          )}
          {order.orders[0].orderType === ORDER_TYPE_DELIVERY &&
            driver?._id !== "" &&
            driver !== undefined && (
              <DriverInfoModal
                driverId={driver?._id}
                orderId={order?._id?.toString()}
                balancedByDriver={order?.balancedByDriver}
                storeId={userDocument?._id}
              />
            )}
        </Group>
        <Box
          sx={(theme) => ({
            [theme.fn.smallerThan("sm")]: {
              overflowX: "scroll",
            },
          })}
        >
          <Table
            sx={{
              overflowX: "scroll",
            }}
          >
            <thead>
              <tr>
                <th>{t("Name")}</th>
                <th>{t("Quantity")}</th>
                <th>{t("Image")}</th>
                <th>{t("Options")}</th>
                <th>{t("Instructions")}</th>
                {(status === "pending" || status === "accepted") && (
                  <th
                    style={{
                      margin: "0px auto",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {t("Control")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {storeOrder.addedProducts.map((product, index) => {
                const pickUp = (pickupCount) => {
                  console.log({
                    storeId: storeOrder._id,
                    productKey: product.key,
                    QTYFound: pickupCount,
                  });

                  setProductAsPickedUp({
                    orderId: order._id,
                    productKey: product.key,
                    QTYFound: pickupCount,
                  });
                };

                const notFound = () => {
                  setProductAsNotFound({
                    orderId: order._id,
                    productKey: product.key,
                  });
                };
                return (
                  <tr>
                    <td>
                      <Text>{product.textInfo.title}</Text>
                      {/* {product.options?.length > 0 && (
                      <Container>
                      {product.options.map((option) => {
                        return (
                          <Box
                          sx={{
                            display: 'flex',
                          }}
                          >
                          <Text>{option.optionName}:</Text>
                          {option.optionValues.map((value) => {
                            return (
                              <Badge m={'0px 6px'} size="md">
                              {value.name}
                              </Badge>
                              )
                            })}
                            </Box>
                            )
                          })}
                          </Container>
                        )} */}
                    </td>
                    <td>{product.qty}</td>
                    <td>
                      {/* <Image
                      radius={4}
                      sx={{
                        width: '45px',
                        height: '45px',
                        maxWidth: '45px',
                        maxHeight: '45px',
                      }}
                      src={`${import.meta.env.VITE_APP_BUCKET_URL}/tablet/${product.images[0]}`}
                    /> */}
                      <ImageModal
                        radius={4}
                        sx={{
                          width: "45px",
                          height: "45px",
                          maxWidth: "45px",
                          maxHeight: "45px",
                        }}
                        src={`${import.meta.env.VITE_APP_BUCKET_URL}/tablet/${
                          product.images[0]
                        }`}
                      />
                    </td>
                    <td>
                      {product.options.length > 0 ? (
                        <OptionsModal options={product.options} />
                      ) : (
                        <Text weight={700}>{t("No options")}</Text>
                      )}
                    </td>
                    <td>
                      {product.instructions ? (
                        <InstructionsModal
                          instructions={product.instructions}
                        />
                      ) : (
                        <Text weight={700}>{t("No instructions")}</Text>
                      )}
                    </td>
                    {(status === "pending" || status === "accepted") && (
                      <td>
                        <ControlButton
                          pickUp={pickUp}
                          notFound={notFound}
                          productQTY={product.qty}
                          found={product?.pickup}
                        />
                        {/* <SetProductAsInactiveButton
                      product={product}
                      updateProductState={updateProductState}
                    /> */}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Box>
        <Group>
          {
            // userDocument.storeType.includes(STORE_TYPE_RESTAURANT) ? (
            status === "pending" && (
              <Button
                onClick={() => {
                  rejectOrder(order._id);
                }}
              >
                {t("Reject Order")}
              </Button>
            )
            // ) : (
            //   <Button
            //     onClick={() => {
            //       rejectOrder(order._id)
            //     }}
            //   >
            //     {t('Reject Order')}
            //   </Button>
            // )
          }
          {
            // userDocument.storeType.includes(STORE_TYPE_RESTAURANT) && (
            <Group>
              {status === "pending" && (
                <>
                  <Button
                    compact
                    onClick={() => {
                      setOrderAsAccepted({
                        orderId: order._id,
                        storeId: storeOrder._id,
                      });
                    }}
                  >
                    {t("Accept Order")}
                  </Button>
                </>
              )}
              {status === "paid" && (
                <Button
                  compact
                  onClick={() => {
                    setOrderAsReady({
                      orderId: order._id,
                      storeId: storeOrder._id,
                    });
                  }}
                >
                  {t("Order is ready")}
                </Button>
              )}
              {/* {status === "preparing" && (
              <Button
              compact
              onClick={() => {
                setOrderAsReady({
                  orderId: order._id,
                  storeId: storeOrder._id,
                });
              }}
              >
              {t("Order is ready")}
              </Button>
            )} */}
            </Group>
            // )
          }
        </Group>
        {status === STORE_STATUS_READY && (
          <DeliveryConfirmationModal
            confirmationCode={storeOrder.pickupConfirmation}
          />
        )}
      </Card>
    </Container>
  );
}
