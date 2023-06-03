import {
  Button,
  Menu,
  Modal,
  Stack,
  TextInput,
  Textarea,
  UnstyledButton,
} from "hyfn-client";

import { t } from "utils/i18nextFix";
import React, { useState } from "react";
import { useReportOrder } from "../hooks/useReportOrder";

interface ReportModalProps {
  orderId: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ orderId }) => {
  const [opened, setOpened] = useState(false);
  const [report, setReport] = useState("");
  const { mutate: submitReport } = useReportOrder();
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
      >
        <Stack>
          <Textarea
            label={t("Your Report")}
            value={report}
            onChange={(e) => setReport(e.target.value)}
          />
          {/* <FullTextEditor value={textEditor} setValue={setTextEditor} /> */}
          <Button
            mt={14}
            fullWidth
            onClick={() => {
              submitReport({ orderId, report: { report } });
            }}
          >
            {t("Submit")}
          </Button>
        </Stack>
      </Modal>
      <Button
        variant="subtle"
        color="red"
        onClick={() => {
          console.log("open");

          setOpened(true);
        }}
        sx={{
          color: "red",
        }}
      >
        {t("Report")}
      </Button>
      {/* <Menu.Item
        color="red"
        onClick={() => {
          console.log('open');

          setOpened(true);
        }}
      >
        {t('Report')}
      </Menu.Item> */}
    </>
  );
};

export default ReportModal;
