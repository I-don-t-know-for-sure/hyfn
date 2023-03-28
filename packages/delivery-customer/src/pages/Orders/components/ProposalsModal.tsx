import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useLocation } from "contexts/locationContext/LocationContext";
import React, { useState } from "react";
import { t } from "util/i18nextFix";
import { useAcceptProposal } from "../hooks/useAcceptProposal";
import ManagementInfoModal from "./ManagementInfoModal";

interface ProposalsModalProps {
  proposals: any[];

  orderId: string;
}

const ProposalsModal: React.FC<ProposalsModalProps> = ({
  proposals,

  orderId,
}) => {
  const [{ country }] = useLocation();
  const [opened, setOpened] = useState(false);
  const { mutate: acceptProposal } = useAcceptProposal();
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        {proposals.map((proposal) => {
          return (
            <Group>
              <TextInput label={t("Price")} value={proposal?.price} readOnly />
              <ManagementInfoModal managementId={proposal.managementId} />
              <Button
                onClick={() => {
                  acceptProposal({
                    country,
                    driverManagementId: proposal.managementId,
                    orderId,
                  });
                }}
              >
                {t("Accept")}
              </Button>
            </Group>
          );
        })}
      </Modal>
      <Button compact onClick={() => setOpened(true)}>
        {t("Proposals")}
      </Button>
    </>
  );
};

export default ProposalsModal;
