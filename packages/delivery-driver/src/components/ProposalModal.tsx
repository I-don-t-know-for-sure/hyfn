import { Button, Modal, NumberInput, Stack, TextInput } from "@mantine/core";
import { useDeleteProposal } from "Pages/Home/hooks/useDeleteProposal";

import { useState } from "react";
import { t } from "utils/i18nextFix";
import { useCreateProposal } from "../Pages/Home/hooks/useCreateProposal";
import { useUpdateProposal } from "../Pages/Home/hooks/useUpdatePropsal";

interface ProposalModalProps {
  proposal?: any;
  orderId: string;
}

const ProposalModal: React.FC<ProposalModalProps> = ({ proposal, orderId }) => {
  const [price, setPrice] = useState(proposal?.price as number);
  const [opened, setOpened] = useState(false);
  const { data, mutate: createProposal } = useCreateProposal();
  const { mutate: updateProposal } = useUpdateProposal();
  const { mutate: deleteProposal } = useDeleteProposal();
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (proposal) {
              updateProposal({ orderId, price });
              return;
            }

            createProposal({ orderId, price });
          }}
        >
          <Stack>
            <NumberInput
              label={t("Price")}
              required
              value={price}
              onChange={(e) => setPrice(e as number)}
            />
            <Button type="submit">
              {proposal ? t("Update proposal") : t("Make proposal")}
            </Button>
            {proposal && (
              <Button
                color={"red"}
                onClick={() => {
                  deleteProposal({ orderId });
                }}
              >
                {t("Delete")}
              </Button>
            )}
          </Stack>
        </form>
      </Modal>
      <Button onClick={() => setOpened(true)}>
        {proposal ? t("Update proposal") : t("Make proposal")}
      </Button>
    </>
  );
};

export default ProposalModal;
