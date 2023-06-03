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
} from "hyfn-client";
import { useRefreshOrderDocument } from "../hooks/useRefreshOrderDocument";
import TransactionModal from "./TransactionModal";
import DriverInfoModal from "./DriverInfoModal";
import OptionsModal from "./OptionsModal";
import {
  ORDER_TYPE_DELIVERY,
  STORE_STATUS_READY,
  STORE_TYPE_RESTAURANT,
  storeAppText,
} from "hyfn-types";
import { t } from "utils/i18nextFix";
import InstructionsModal from "./InstructionsModak";

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
    { orderId: order.id }
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
          {order.storeStatus[order.storeStatus.length - 1] === "paid" ? (
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
              setOrderAsDelivered({ orderId: order?.id?.toString() });
            }}
            aria-label="set to delivered"
          />
        </Group>
        <Group position="apart">
          <Text>{order.id}</Text>
        </Group>
        <Group>
          {/* {Array.isArray(order.transactions) && (
            <TransactionModal
              validateTransaction={validateTransaction}
              transactions={storeOrder.transactions}
              storeProducts={storeOrder.addedProducts}
            />
          )} */}
          {order.orderType === ORDER_TYPE_DELIVERY &&
            driver?.id !== "" &&
            driver !== undefined && (
              <DriverInfoModal
                driverId={driver?.id}
                orderId={order?.id?.toString()}
                balancedByDriver={order?.balancedByDriver}
                storeId={userDocument?.id}
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
              {order.addedProducts.map((product, index) => {
                const pickUp = (pickupCount) => {
                  setProductAsPickedUp({
                    orderId: order.id,
                    productId: product.id,
                    QTYFound: pickupCount,
                  });
                };

                const notFound = () => {
                  setProductAsNotFound({
                    orderId: order.id,
                    productId: product.id,
                  });
                };
                return (
                  <tr>
                    <td>
                      <Text>{product.title}</Text>
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
                      {product?.options?.length > 0 ? (
                        <OptionsModal options={product?.options} />
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
                  rejectOrder(order.id);
                }}
              >
                {t("Reject Order")}
              </Button>
            )
            // ) : (
            //   <Button
            //     onClick={() => {
            //       rejectOrder(order.id)
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
                        orderId: order.id,
                        storeId: order.stores[0].id,
                      });
                    }}
                  >
                    {t(storeAppText["Accept Order"])}
                  </Button>
                </>
              )}
              {status === "paid" && (
                <Button
                  compact
                  onClick={() => {
                    setOrderAsReady({
                      orderId: order.id,
                      storeId: order.stores[0].id,
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
                  orderId: order.id,
                  storeId: storeOrder.id,
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
            confirmationCode={order.storePickupConfirmation}
          />
        )}
      </Card>
    </Container>
  );
}
