import React from "react";
import { useGetProposals } from "../hooks/useGetProposals";
import { useUser } from "contexts/userContext/User";
import { ACCEPTED_PROPOSALS_FLAG, ALL_PROPOSALS_FLAG } from "hyfn-types";
import { Button, Center, Container, Loader, Text } from "hyfn-client";
import { t } from "utils/i18nextFix";
import AvailableOrder from "components/AvailableOrder";

interface AcceptedProposalsProps {}

const AcceptedProposals: React.FC<AcceptedProposalsProps> = ({}) => {
  const { userDocument } = useUser();
  const {
    data: orders,
    isError,
    isFetched,
    isLoading,

    fetchNextPage,
  } = useGetProposals({
    flag: ACCEPTED_PROPOSALS_FLAG,
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
                ]?.id,
            })
          }
        >
          {t("Load more")}
        </Button>
      </Center>
    </>
  );
};

export default AcceptedProposals;
