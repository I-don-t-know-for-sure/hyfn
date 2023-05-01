import {
  ActionIcon,
  Button,
  Center,
  Container,
  CopyButton,
  Group,
  Modal,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { storeTypes } from "hyfn-types";

import { useLocation } from "contexts/locationContext/LocationContext";
import { t } from "util/i18nextFix";
import React, { useState } from "react";
import { BsInfoCircle } from "react-icons/bs";

interface StoreDetailsModalProps {
  storeDetails: any;
}

const StoreDetailsModal: React.FC<StoreDetailsModalProps> = ({
  storeDetails,
}) => {
  console.log(
    "🚀 ~ file: StoreDetailsModal.tsx:13 ~ storeDetails",
    storeDetails
  );
  const [opened, setOpened] = useState(false);
  // const [{ coords }] = useLocation();

  const coords = `${storeDetails.coords.coordinates[1]},${storeDetails.coords.coordinates[0]}`;
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Group>
            <Text>{coords}</Text>

            <CopyButton value={coords} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy"}
                  withArrow
                  position="right"
                >
                  <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                    {copied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-check"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path
                          d="M5 12l5 5l10 -10"
                          style={{
                            fontSize: 16,
                          }}
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-copy"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
                        <path
                          d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
                          style={{
                            fontSize: 16,
                          }}
                        ></path>
                      </svg>
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
        }
      >
        <Stack>
          <Group grow>
            <TextInput
              readOnly
              value={storeDetails.storeName}
              label={t("Store Name")}
            />
            <TextInput
              readOnly
              value={storeDetails.storePhone}
              label={t("Store Phone")}
            />
          </Group>

          <MultiSelect
            sx={{
              width: "100%",
            }}
            data={storeTypes}
            value={storeDetails.storeType}
            readOnly
          />
        </Stack>
      </Modal>
      <ActionIcon
        onClick={() => setOpened(true)}
        sx={{
          width: "fit-content",
          hight: "fit-content",
        }}
      >
        {t("More info")}
        <BsInfoCircle
          style={{
            marginLeft: "4px",
          }}
        />
      </ActionIcon>
    </>
  );
};

export default StoreDetailsModal;
