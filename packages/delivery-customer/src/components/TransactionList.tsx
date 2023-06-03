import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  Text,
  TextInput,
  UnstyledButton,
} from "hyfn-client";
import { useGetTransactions } from "hooks/useGetTransactions";

import { t } from "util/i18nextFix";
import React, { useState } from "react";

import CancelTransactionModal from "./CancelTransactionModal";

import { useValidateTransaction } from "hooks/useValidateTransaction";

interface TransactionListProps {
  menu?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ menu }) => {
  const [opened, setOpened] = useState(false);
  const {
    data: transactions,
    isLoading,
    fetchNextPage,
  } = useGetTransactions({ enabled: opened });
  // const { mutate: validateTransaction } = useValidateLocalCardTransaction();
  // const { mutate: validateStoreLocalCardTransaction } =
  //   useValidateStoreLocalCardTransaction();
  // const { mutate: validateManagementLocalCardTransaction } =
  //   useValidateManagementLocalCardTransaction();
  const { mutate: validateTransaction } = useValidateTransaction();
  console.log("🚀 ~ file: TransactionList.tsx ~ line 8 ~ data", transactions);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        {isLoading ? (
          <Loader />
        ) : (
          transactions &&
          transactions.pages.map((page) => {
            return page.map((transaction) => {
              return (
                <Paper shadow={"md"} withBorder key={transaction.id} mt={12}>
                  <Box m={"md"}>
                    <Group>
                      <Text weight={700}>{`id : ${transaction.id}`}</Text>
                    </Group>
                    <Group
                      grow
                      position="apart"
                      sx={{
                        maxWidth: 500,
                        width: "80%",
                        margin: "0px auto",
                      }}
                    >
                      <TextInput
                        label={t("Store")}
                        value={transaction.storeId}
                        readOnly
                        variant="unstyled"
                      />
                      <TextInput
                        label={t("Amount")}
                        value={transaction.amount}
                        readOnly
                        variant="unstyled"
                      />
                      <TextInput
                        label={t("Validated")}
                        value={
                          transaction.status[transaction.status.length - 1]
                        }
                        readOnly
                        variant="unstyled"
                      />
                    </Group>
                    <Group
                      grow
                      sx={{
                        alignItems: "baseline",
                      }}
                    >
                      {!transaction.validated && (
                        <Button
                          onClick={() => {
                            validateTransaction({
                              transactionId: transaction.id,
                            });

                            // if (
                            //   transaction.type ===
                            //   TRANSACTION_TYPE_DRIVER_MANAGMENT
                            // ) {
                            //   validateManagementLocalCardTransaction({
                            //     transactionId: transaction.id,
                            //   });
                            //   return;
                            // }
                            // if (transaction.storeId !== adminName) {
                            //   validateStoreLocalCardTransaction({
                            //     transactionId: transaction.id,
                            //   });
                            //   return;
                            // }
                            // validateTransaction({
                            //   transactionId: transaction.id,
                            // });
                          }}
                          mt={16}
                        >
                          {t("Validate")}
                        </Button>
                      )}
                      {!transaction.status.includes("canceled") && (
                        <CancelTransactionModal
                          transactionId={transaction.id}
                        />
                      )}
                    </Group>
                  </Box>
                </Paper>
              );
            });
          })
        )}

        <Center m={"12px auto"}>
          <Button
            sx={{
              width: "100%",
              maxWidth: "450px",
            }}
            onClick={() =>
              fetchNextPage({
                pageParam:
                  transactions?.pages[transactions?.pages?.length - 1][
                    transactions?.pages[transactions.pages?.length - 1]
                      ?.length - 1
                  ]?.id,
              })
            }
          >
            {t("Load more")}
          </Button>
        </Center>
      </Modal>
      {menu ? (
        <UnstyledButton
          onClick={() => setOpened(true)}
          sx={(theme) => ({
            padding: " 6px 28px",
            textDecoration: "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",

            color: theme.colorScheme === "dark" ? theme.white : theme.black,
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "light"
                  ? theme.colors.gray[2]
                  : theme.colors.gray[9],
            },
            borderRadius: "8px",
          })}
        >
          {t("Transactions")}
        </UnstyledButton>
      ) : (
        <Button fullWidth onClick={() => setOpened(true)}>
          {t("Transactions")}
        </Button>
      )}
    </>
  );
};

export default TransactionList;
function TextWithLabel({ label, value }: { label: string; value: any }) {
  return (
    <Box>
      <Text weight={700}>{label}</Text>
      <Text>{value}</Text>
    </Box>
  );
}
