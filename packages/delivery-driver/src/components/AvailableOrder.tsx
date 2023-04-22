import { Button, Card, Group, Text } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { CopyButton } from "hyfn-client";
import { useTakeOrder } from "Pages/Proposals/hooks/useTakeOrder";
import React from "react";
import { Link } from "react-router-dom";
import { t } from "utils/i18nextFix";
import ProposalModal from "./ProposalModal";

interface AvailableOrderProps {
  order: any;
  userDocument: any;
}
const AvailableOrder: React.FC<AvailableOrderProps> = ({
  order,
  userDocument,
}) => {
  const { mutate: takeOrder } = useTakeOrder();
  console.log("🚀 ~ file: AvailableOrder.tsx:63 ~ userDocument:", userDocument);
  const driverManagement = Array.isArray(userDocument?.driverManagement)
    ? userDocument?.driverManagement[0]
    : "";

  return (
    <Card m={"24px auto"} key={order?._id.toString()}>
      <Group>
        <Text>{order?._id.toString()}</Text>

        <CopyButton
          value={`${order?.coords?.coordinates[0][1]},${order?.coords?.coordinates[0][0]}`}
        />
        <DateTimePicker
          value={new Date(order.deliveryDate)}
          label={t("Delivery date")}
          readOnly
        />
      </Group>

      <Group
        mb={2}
        m={"12px auto"}
        position="center"
        grow
        sx={{
          maxWidth: "400px",
        }}
      >
        <ProposalModal
          orderId={order._id.toString()}
          proposal={order?.proposals?.find(
            (proposal) => proposal?.managementId === driverManagement
          )}
        />
        {driverManagement === order.acceptedProposal && (
          <Group>
            <Button
              onClick={() => {
                console.log(
                  "sjnhdbchdbchdbchdbchbdchbhdbchdhbdhcbhdbchbdhcbhdcbhdbchbdho"
                );

                takeOrder({ orderId: order._id.toString() });
              }}
            >
              {t("Take order")}
            </Button>
          </Group>
        )}
        <Button
          target="_blank"
          rel="noopener noreferrer"
          to={`https://www.google.com/maps/search/?api=1&query=${order?.coords?.coordinates[0][1]},${order?.coords?.coordinates[0][0]}`}
          component={Link}
        >
          {t("See on map")}
        </Button>
      </Group>
    </Card>
  );
};

export default AvailableOrder;
