import {
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Text,
  TextInput,
} from "@mantine/core";

import { t } from "utils/i18nextFix";
import React from "react";

import { calculateDuration } from "utils/calculateDuration";

import { useGetOrders } from "./hooks/useOrders";
import { CopyButton } from "hyfn-client";
import ProposalModal from "../../components/ProposalModal";
import { useUser } from "contexts/userContext/User";
import { Link } from "react-router-dom";
import { DateTimePicker } from "@mantine/dates";
import AvailableOrder from "components/AvailableOrder";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const {
    data: orders,
    isLoading,
    isError,
    isFetching,
    isFetched,
    fetchNextPage,
  } = useGetOrders();
  const { userDocument } = useUser();
  console.log(orders);

  return (
    <Container>
      <>
        {isLoading || isFetching ? (
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
                    // AvailabeOrder(order, userDocument)
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
    </Container>
  );
};

export default Home;
// function AvailabeOrder({order,userDocument}:{order: any, userDocument: any}): JSX.Element {
//   return <Card m={"24px auto"} key={order?._id.toString()}>
//     <Group>
//       <Text>{order?._id.toString()}</Text>

//       <CopyButton
//         value={`${order?.coords?.coordinates[0][1]},${order?.coords?.coordinates[0][0]}`} />
//       <DateTimePicker
//         value={new Date(order.deliveryDate)}
//         label={t("Delivery date")}
//         readOnly />
//       <Button
//         target="_blank"
//         rel="noopener noreferrer"
//         to={`https://www.google.com/maps/search/?api=1&query=${order?.coords?.coordinates[0][1]},${order?.coords?.coordinates[0][0]}`}
//         component={Link}
//       >
//         {t("See on map")}
//       </Button>
//       <Text>
//         {t("Number of stores")} : {order?.orders?.length}
//       </Text>
//     </Group>

//     <Group
//       mb={2}
//       m={"12px auto"}
//       position="center"
//       grow
//       sx={{
//         maxWidth: "400px",
//       }}
//     >
//       <ProposalModal
//         orderId={order._id.toString()}
//         proposal={order?.proposals?.find(
//           (proposal) => proposal.managementId ===
//             userDocument.driverManagement[0]
//         )} />
//     </Group>
//   </Card>;
// }
