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
  UnstyledButton,
} from "hyfn-client";
import { useGetTransactions } from "hooks/useGetTransactions";

import { useValidateLocalCardTransaction } from "hooks/useValidateLocalCardTransaction";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";

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
  const { mutate: validateTransaction } = useValidateLocalCardTransaction();
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
                      <>
                        {TextWithLabel({
                          label: "Store",
                          value: transaction.storeId,
                        })}
                      </>

                      <TextWithLabel
                        label="Amount"
                        value={transaction.amount || 0}
                      />
                      <TextWithLabel
                        label="Validated"
                        value={`${transaction.validated}`}
                      />
                    </Group>
                    {!transaction.validate && (
                      <Button
                        onClick={() =>
                          validateTransaction({ transactionId: transaction.id })
                        }
                        mt={16}
                        fullWidth
                      >
                        {t("Validate")}
                      </Button>
                    )}
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
