import {
  Badge,
  Box,
  Button,
  Center,
  Group,
  Image,
  Modal,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { storeServiceFee } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";

import { useState } from "react";

interface TransactionModalProps {
  transactions: any[];
  validateTransaction: any;
  storeProducts: any[];
}
const TransactionModal: React.FC<TransactionModalProps> = ({
  transactions,
  validateTransaction,
  storeProducts,
}) => {
  const [opened, setOpened] = useState(false);
  const { userDocument } = useUser();
  const orderTotal = storeProducts.reduce((accu, currentProduct) => {
    return (
      accu + currentProduct.pricing.price * currentProduct?.pickup?.QTYFound
    );
  }, 0);
  const orderSaleFee = orderTotal * storeServiceFee;
  const orderTotalAfterFee = orderTotal - orderSaleFee;
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Table m={"sm"}>
          <thead>
            <tr>
              <th>{t("Name")}</th>
              <th>{t("QTY found")}</th>
              <th>{t("Image")}</th>
            </tr>
          </thead>
          <tbody>
            {storeProducts?.map((product) => {
              return (
                <tr>
                  <td>{product?.textInfo?.title}</td>
                  <td>{product?.pickup?.QTYFound || 0}</td>
                  <td>
                    <Image
                      radius={4}
                      sx={{
                        maxWidth: "45px",
                        maxHeight: "45px",
                      }}
                      src={`${import.meta.env.VITE_APP_BUCKET_URL}/tablet/${
                        product.images[0]
                      }`}
                    />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table>

        <Stack m={"sm"}>
          <Group position="apart">
            <Text>{t("Order total")}</Text>
            <Text>{`${userDocument.currency || "LYD"} ${orderTotal}`}</Text>
          </Group>
          <Group position="apart">
            <Text>{t("Order sale fee")}</Text>
            <Text>{`${userDocument.currency || "LYD"} ${orderSaleFee}`}</Text>
          </Group>
          <Group position="apart">
            <Text>{t("Order Total after fee")}</Text>
            <Text>{`${
              userDocument.currency || "LYD"
            } ${orderTotalAfterFee}`}</Text>
          </Group>
        </Stack>

        {Array.isArray(transactions) ? (
          <Table m={"sm"}>
            <thead>
              <tr>
                {/* <th>{t('ID')}</th> */}
                <th>{t("Payment method")}</th>
                <th>{t("Amount")}</th>
                <th>{t("Validated")}</th>
              </tr>
            </thead>
            <tbody
              style={{
                width: "100%",
              }}
            >
              {transactions?.map((transaction) => {
                return (
                  <tr key={transaction._id}>
                    {/* <td>{transaction._id}</td> */}
                    <td>{transaction.paymentMethod}</td>
                    <td>{transaction.amount}</td>
                    <td>
                      {transaction.validated ? (
                        <Badge color={"green"}>{t("Validated")}</Badge>
                      ) : (
                        <Button
                          onClick={() =>
                            validateTransaction({
                              transactionId: transaction._id,
                            })
                          }
                        >
                          {t("Validate")}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <Center m={"sm"}>
            <Text>{t("No transactions yet")}</Text>
          </Center>
        )}
      </Modal>
      <Button
        onClick={() => {
          setOpened(true);
        }}
      >
        {t("Show transactions")}
      </Button>
    </>
  );
};

export default TransactionModal;
