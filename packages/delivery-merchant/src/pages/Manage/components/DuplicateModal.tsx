import {
  ActionIcon,
  Button,
  Center,
  Group,
  Modal,
  NumberInput,
  NumberInputHandlers,
  Title,
} from "@mantine/core";
import { t } from 'utils/i18nextFix';
import React, { useRef, useState } from "react";
import { useDuplicateProduct } from "../hooks/useDuplicateProduct";

interface DuplicateModalProps {
  productId: string;
}

const DuplicateModal: React.FC<DuplicateModalProps> = ({ productId }) => {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState(0);
  const { mutate } = useDuplicateProduct();
  const handlers = useRef<NumberInputHandlers>();
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Title> {`X ${value}`}</Title>
        <Center>
          <Group spacing={5} m={"4px auto"}>
            <ActionIcon
              size={42}
              variant="default"
              onClick={() => handlers.current.decrement()}
            >
              –
            </ActionIcon>

            <NumberInput
              hideControls
              value={value}
              onChange={(val) => setValue(val)}
              handlersRef={handlers}
              max={30}
              min={1}
              step={1}
              stepHoldDelay={500}
              stepHoldInterval={100}
              styles={{ input: { width: 54, textAlign: "center" } }}
            />

            <ActionIcon
              size={42}
              variant="default"
              onClick={() => handlers.current.increment()}
            >
              +
            </ActionIcon>
          </Group>
        </Center>
        <Button onClick={() => mutate({ productId, times: value })}>
          {t("Duplicate")}
        </Button>
      </Modal>
      <Button variant="outline" size="xs" onClick={() => setOpened(true)}>
        {t("Duplicate")}
      </Button>
    </>
  );
};

export default DuplicateModal;
