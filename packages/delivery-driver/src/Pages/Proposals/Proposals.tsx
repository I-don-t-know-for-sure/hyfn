import { useEffect, useState } from "react";
import { useGetProposals } from "./hooks/useGetProposals";
// import { ACCEPTED_PROPOSALS_FLAG, ALL_PROPOSALS_FLAG } from "hyfn-types";
import {
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Text,
} from "@mantine/core";
import { t } from "utils/i18nextFix";
import { CopyButton } from "hyfn-client";
import ProposalModal from "components/ProposalModal";
import { useUser } from "contexts/userContext/User";
import { useTakeOrder } from "./hooks/useTakeOrder";
import AvailableOrder from "components/AvailableOrder";
import AllProposals from "./components/AllProposals";
import AcceptedProposals from "./components/AcceptedProposals";
interface ProposalsProps {}

const Proposals: React.FC<ProposalsProps> = () => {
  const [flag, setFlag] = useState<string>(ALL_PROPOSALS_FLAG);

  return (
    <Container>
      <Container mt={12}>
        <Group grow>
          <Button variant="outline" onClick={() => setFlag(ALL_PROPOSALS_FLAG)}>
            {t("All")}
          </Button>
          <Button
            variant="outline"
            onClick={() => setFlag(ACCEPTED_PROPOSALS_FLAG)}
          >
            {t("Accepted")}
          </Button>
        </Group>
      </Container>
      {flag === ALL_PROPOSALS_FLAG && <AllProposals />}
      {flag === ACCEPTED_PROPOSALS_FLAG && <AcceptedProposals />}
    </Container>
  );
};
export default Proposals;
