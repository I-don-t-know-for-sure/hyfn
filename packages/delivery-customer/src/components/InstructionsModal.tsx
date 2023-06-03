import { Button, Modal, Stack, TextInput } from "hyfn-client";
import { t } from "util/i18nextFix";
import React, { useState } from "react";

interface InstructionsModalProps {
  updateProductInstructions: (instructions: string) => void;
  prevInstructions: string;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({
  updateProductInstructions,
  prevInstructions,
}) => {
  const [opened, setOpened] = useState(false);
  const [instructions, setInstructions] = useState(prevInstructions || "");
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("Add instructions to this item")}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProductInstructions(instructions);
            setOpened(false);
          }}
        >
          <Stack>
            <TextInput
              required
              value={instructions}
              onChange={(e) => setInstructions(e.currentTarget.value)}
            />
            <Button type="submit">{t("Add Instructions")}</Button>
          </Stack>
        </form>
      </Modal>
      <Button variant="subtle" onClick={() => setOpened(true)}>
        {" "}
        {t("Instructions")}
      </Button>
    </>
  );
};

export default InstructionsModal;
