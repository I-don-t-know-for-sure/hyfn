import {
  Box,
  Card,
  CardSection,
  Paper,
  Skeleton,
  Text,
  TextInput,
} from "hyfn-client";
import { t } from "utils/i18nextFix";
import React from "react";

const InfoCard: React.FC<{
  onChangeHandler?: (
    value: any,
    firstChangedKey: string,
    changedKey?: string
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
            value={info.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeHandler(e.target.value, "title")
            }
          />
          <TextInput
            required
            label={t("Collection description")}
            value={info.description || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeHandler(e.target.value, "description")
            }
          />
        </>
      )}
    </Paper>
  );
};

export default InfoCard;
