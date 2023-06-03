import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Text,
  TextInput,
} from "hyfn-client";
import { t } from "util/i18nextFix";
import React, { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdFoundation } from "react-icons/md";

interface PickupModalProps {
  qty: number;
  pickup: (foundCount: number) => void;
  notFound: () => void;
  found: any;
}

const PickupModal: React.FC<PickupModalProps> = ({
  qty,
  pickup,
  notFound,
  found,
}) => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(found ? found?.QTYFound : qty);
  return (
    <>
      <Modal opened={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "auto 26px",
            }}
          >
            <ActionIcon
              variant="outline"
              onClick={() => setCount(count > 1 ? count - 1 : 1)}
              size={38}
            >
              <AiOutlineMinus />
            </ActionIcon>
            <NumberInput
              hideControls
              m={"auto 15px"}
              value={count}
              onChange={(e) => {
                setCount((e as number) > qty ? qty : e);
              }}
              min={1}
              max={qty}
            />

            <ActionIcon
              variant="outline"
              onClick={() => setCount(qty > count ? count + 1 : count)}
              size={38}
            >
              <AiOutlinePlus />
            </ActionIcon>
          </Box>

          <Button onClick={() => pickup(count)}>{t("Set as Picked up")}</Button>
        </Box>
        <Group mt={16} position="center" grow>
          <Button onClick={notFound} color={"red"}>
            {t("Not found")}
          </Button>
        </Group>
      </Modal>
      {/* <Group position="center"> */}
      <Button
        mb={6}
        sx={{
          maxWidth: 100,
        }}
        onClick={() => setOpen(true)}
      >
        {t("Pickup")}
      </Button>
      {/* </Group> */}
    </>
  );
};

export default PickupModal;
