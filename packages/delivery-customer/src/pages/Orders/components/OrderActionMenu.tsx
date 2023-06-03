import { ActionIcon, Menu } from "hyfn-client";

import { t } from "util/i18nextFix";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useCancelOrder } from "../hooks/useCancelOrder";

import { useReportOrder } from "../hooks/useReportOrder";
import ReportModal from "./ReportModal";
import { ORDER_TYPE_DELIVERY } from "hyfn-types";

interface OrderActionMenuProps {
  orderId: string;
  orderType: string;
  isOrderTakenByDriver: boolean;
}

const OrderActionMenu: React.FC<OrderActionMenuProps> = ({
  orderId,
  orderType,
  isOrderTakenByDriver,
}) => {
  const [opened, setOpened] = useState(false);
  const { mutate: cancelOrder } = useCancelOrder();
  const { mutate: reportOrder } = useReportOrder();

  return (
    <Menu closeOnClickOutside={false}>
      <Menu.Target>
        <ActionIcon>
          <BsThreeDotsVertical />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          sx={{
            textAlign: "center",
          }}
          color={"orange"}
          onClick={() => {
            cancelOrder({ orderId });
          }}
        >
          {t("Cancel")}
        </Menu.Item>
        {/* <Menu.Item
          color={'red'}
          onClick={() => {
            reportOrder({ orderId });
          }}
        >
          {t('Report')}
        </Menu.Item> */}
        {/* <Menu.Item
          color={'red'}
          // onClick={() => {
          //   reportOrder({ orderId });
          // }}
        > */}
        {orderType === ORDER_TYPE_DELIVERY && isOrderTakenByDriver && (
          <ReportModal orderId={orderId} />
        )}
        {/* </Menu.Item> */}
      </Menu.Dropdown>
    </Menu>
  );
};

export default OrderActionMenu;
