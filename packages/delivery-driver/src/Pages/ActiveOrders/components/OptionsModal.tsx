import { Badge, Button, Group, Modal, Text } from "@mantine/core";
import { t } from "utils/i18nextFix";
import { useState } from "react";
interface OptionsModalProps {
  options: any[];
}
const OptionsModal: React.FC<OptionsModalProps> = ({ options }) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        {options.map((option) => {
          return (
            <Group key={option.key}>
              <Text weight={700}>{option.optionName}</Text> :{" "}
              {option.optionValues.map((value) => {
                return (
                  <Badge key={value.key} m={"0px 6px"} size="md">
                    {value.value}
                  </Badge>
                );
              })}
            </Group>
          );
        })}
      </Modal>
      <Button onClick={() => setOpened(true)}>{t("Show Options")}</Button>
    </>
  );
};

export default OptionsModal;
