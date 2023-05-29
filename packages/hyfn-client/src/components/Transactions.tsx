import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  Paper,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";

import { t } from "i18next";
import React, { useState } from "react";
import CancelTransactionModal from "./CancelTransactionModal";
import { getPagesLength } from "../functions";

interface TransactionsProps {
  menu?: boolean;
  useGetTransactions: any;
}

const Transactions: React.FC<TransactionsProps> = ({
  menu,
  useGetTransactions,
}) => {
  const [opened, setOpened] = useState(false);
  const {
    data: transactions,
    isLoading,
    fetchNextPage,
  } = useGetTransactions({ enabled: opened });

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
                        label={t("Store") as any}
                        value={transaction.storeId}
                        readOnly
                        variant="unstyled"
                      />
                      <TextInput
                        label={t("Amount") as any}
                        value={transaction.amount}
                        readOnly
                        variant="unstyled"
                      />
                      <TextInput
                        label={t("Validated") as any}
                        value={
                          transaction.status[transaction.status.length - 1]
                        }
                        readOnly
                        variant="unstyled"
                      />
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
                pageParam: getPagesLength(transactions),
              })
            }
          >
            {t("Load more") as any}
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
          {t("Transactions") as any}
        </UnstyledButton>
      ) : (
        <Button fullWidth onClick={() => setOpened(true)}>
          {t("Transactions") as any}
        </Button>
      )}
    </>
  );
};

export default Transactions;
