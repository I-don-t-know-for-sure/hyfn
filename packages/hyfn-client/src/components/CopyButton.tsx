import {
  ActionIcon,
  Tooltip,
  CopyButton as OriginalCopyButton,
  Group,
  Text,
} from "@mantine/core";

import React from "react";

interface CopyButtonProps {
  value: string;
  justText?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({ value, justText }) => {
  return (
    <>
      {justText ? (
        <OriginalCopyButton value={value}>
          {({ copied, copy }) => (
            <Tooltip
              label={copied ? "Copied" : "Copy"}
              withArrow
              position="left"
            >
              <Text
                sx={{
                  cursor: "pointer",
                }}
                {...(copied ? { color: "green" } : {})}
                onClick={copy}
                weight={700}
              >
                {copied ? "Copied" : value}
              </Text>
            </Tooltip>
          )}
        </OriginalCopyButton>
      ) : (
        <Group sx={{}}>
          <Text sx={{}} weight={700}>
            {value}
          </Text>
          <OriginalCopyButton value={value} timeout={2000}>
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
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
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
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
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
          </OriginalCopyButton>
        </Group>
      )}
    </>
  );
};

export default CopyButton;
