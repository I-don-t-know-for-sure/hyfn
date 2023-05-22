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
  const driverManagement = userDocument.driverManagement;
  const acceptedProposal = order.acceptedProposal
    ? order.proposals.find(
        (porposal) => porposal.driverId === order.acceptedProposal
      )
    : {};
  console.log(
    "🚀 ~ file: AvailableOrder.tsx:24 ~ acceptedProposal:",
    acceptedProposal
  );
  return (
    <Card m={"24px auto"} key={order?.id}>
      <Group>
        <Text>{order?.id}</Text>

        <CopyButton
          value={`${order?.stores[0].lat},${order?.stores[0].long}`}
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
          orderId={order.id}
          proposal={order?.proposals?.find(
            (proposal) => proposal?.driverId === userDocument.id
          )}
        />
        {driverManagement === acceptedProposal.managementId && (
          <Group>
            <Button
              onClick={() => {
                console.log(
                  "sjnhdbchdbchdbchdbchbdchbhdbchdhbdhcbhdbchbdhcbhdcbhdbchbdho"
                );

                takeOrder({ orderId: order.id });
              }}
            >
              {t("Take order")}
            </Button>
          </Group>
        )}
        <Button
          target="_blank"
          rel="noopener noreferrer"
          to={`https://www.google.com/maps/search/?api=1&query=${order?.stores[0].lat},${order?.stores[0].long}`}
          component={Link}
        >
          {t("See on map")}
        </Button>
      </Group>
    </Card>
  );
};

export default AvailableOrder;
