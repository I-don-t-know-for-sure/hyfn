import { Button, Center, Container, Loader, Text } from "@mantine/core";
import React from "react";
import { t } from "utils/i18nextFix";
import { useGetProposals } from "../hooks/useGetProposals";
import { ALL_PROPOSALS_FLAG } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import AvailableOrder from "components/AvailableOrder";

interface AllProposalsProps {}

const AllProposals: React.FC<AllProposalsProps> = ({}) => {
  const { userDocument } = useUser();

  const {
    data: orders,
    isError,
    isFetched,
    isLoading,
    isFetching,
    fetchNextPage,
    refetch,
  } = useGetProposals({
    flag: ALL_PROPOSALS_FLAG,
    driverManagementId: userDocument.driverManagement[0],
  });
  return (
    <>
      <>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Text>{t("Error")}</Text>
        ) : (
          isFetched &&
          orders &&
          orders?.pages?.map((page) => {
            console.log(page);

            return (
              Array.isArray(page) &&
              page?.map((order) => {
                return (
                  order !== null &&
                  order !== undefined && (
                    <AvailableOrder order={order} userDocument={userDocument} />
                  )
                );
              })
            );
          })
        )}
      </>
      <Center m={"12px auto"}>
        <Button
          sx={{
            width: "100%",
            maxWidth: "450px",
          }}
          onClick={() =>
            fetchNextPage({
              pageParam:
                orders?.pages[orders?.pages?.length - 1][
                  orders?.pages[orders.pages?.length - 1]?.length - 1
                ]?._id,
            })
          }
        >
          {t("Load more")}
        </Button>
      </Center>
    </>
  );
};

export default AllProposals;
