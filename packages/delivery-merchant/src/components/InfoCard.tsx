import {
  Box,
  Card,
  CardSection,
  Paper,
  Skeleton,
  Text,
  TextInput,
} from "@mantine/core";
import { t } from "utils/i18nextFix";
import React from "react";

const InfoCard: React.FC<{
  onChangeHandler?: (
    value: any,
    firstChangedKey: string,
    changedKey: string
  ) => void;
  info: any;
  isLoading?: boolean;
}> = ({ onChangeHandler, info, isLoading }) => {
  return (
    <Paper shadow={"sm"} p={"md"} sx={{}}>
      {isLoading ? (
        <>
          <Box>
            <Text>{t("Collection name")}</Text>
            <Skeleton height={30} />
          </Box>
          <Box>
            <Text>{t("Collection description")}</Text>
            <Skeleton height={30} />
          </Box>
        </>
      ) : (
        <>
          <TextInput
            label={t("Collection name")}
            required
            value={info.textInfo?.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeHandler(e.target.value, "textInfo", "title")
            }
          />
          <TextInput
            required
            label={t("Collection description")}
            value={info.textInfo?.description || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeHandler(e.target.value, "textInfo", "description")
            }
          />
        </>
      )}
    </Paper>
  );
};

export default InfoCard;
