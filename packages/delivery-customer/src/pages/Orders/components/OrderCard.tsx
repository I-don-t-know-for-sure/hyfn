import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Loader,
  Table,
  Text,
} from "@mantine/core";

import { t } from "../../../util/i18nextFix";
import React, { useState } from "react";
import OptionsModal from "./OptionsModal";

interface OrderCardProps {
  order: any;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <Card mt={8}>
      <Text>{order.id}</Text>
      {order.orders.map((store) => {
        return (
          <Box
            key={store?.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text
              variant="text"
              weight={600}
              sx={{
                fontSize: "24px",
                margin: "4px auto",
              }}
            >
              {store.storeName}
            </Text>
            <Table>
              <thead>
                <tr>
                  <th>{t("Name")}</th>
                  <th>{t("Quantity")}</th>
                  <th>{t("Image")}</th>
                  <th>{t("Options")}</th>
                </tr>
              </thead>
              <tbody>
                {store.addedProducts.map((product, index) => {
                  console.log(product);

                  return (
                    <tr key={index}>
                      <td>
                        <Text>{product.textInfo.title}</Text>
                      </td>
                      <td>{product.qty}</td>
                      <td>
                        <Image
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
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Box>
        );
      })}
      <Group>
        {/* <Button
                  onClick={() => {
                    confirmDelivery(order.id);
                  }}
                >
                  confirm delivery
                </Button> */}

        {/* {!order.driverRating && (
          <Box>
            <StarRating
              onRate={(newRating) => {
                setRating(newRating);
              }}
            />
            {rating > 0 && (
              <Button
                onClick={() => {
                  rateDriver({
                    newRating: rating,
                    orderId: order.id,
                  });
                }}
              >
                {t('rate')}
              </Button>
            )}
          </Box>
        )} */}
      </Group>
    </Card>
  );
};

export default OrderCard;
