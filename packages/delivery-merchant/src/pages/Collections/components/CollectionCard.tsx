import {
  Box,
  Card,
  CardSection,
  Checkbox,
  Container,
  Group,
  Header,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { t } from "utils/i18nextFix";
import { forwardRef, useEffect, useState } from "react";
import { CollectionCard } from "../types";

interface StatusCardProps extends CollectionCard {}

const StatusCard: React.FC<StatusCardProps> = ({
  onChangeHandler,
  collectionInfo,
  isLoading,
}) => {
  return (
    <>
      <Paper
        //  sx={{ margin: 'auto' }}
        shadow="sm"
      >
        {isLoading ? (
          <Loader />
        ) : (
          <Box>
            <>
              <Title>{t("Collection status")}</Title>

              <Group
                sx={{ height: 100 }}
                // direction="column"
              >
                <Checkbox
                  label={t("Active")}
                  checked={collectionInfo?.isActive || false}
                  required
                  onChange={(e) => {
                    const checked = e.currentTarget.checked;
                    onChangeHandler(checked, "isActive");
                  }}
                />
                <Checkbox
                  label={t("Draft or InActive")}
                  required
                  checked={!collectionInfo?.isActive || false}
                  onChange={(e) => {
                    const checked = !e.currentTarget.checked;
                    onChangeHandler(checked, "isActive");
                  }}
                />
              </Group>
            </>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default StatusCard;
