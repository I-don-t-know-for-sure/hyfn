import {
  Box,
  Card,
  CardSection,
  Checkbox,
  Divider,
  Loader,
  Paper,
  Radio,
  Space,
} from "hyfn-client";
import { randomId } from "@mantine/hooks";
import { t } from "utils/i18nextFix";
import React from "react";
import { CollectionCard, CollectionInfo } from "../types";
import CollectionConditions from "./CollectionConditions";

interface TypeCardProps extends CollectionCard {}

const TypeCard: React.FC<TypeCardProps> = ({
  onChangeHandler,
  collectionInfo,
  setCollectionInfo,
  isLoading,
}) => {
  return (
    <Paper
      shadow={"sm"}
      p={"md"}
      // sx={{ margin: "auto", marginBlock: 10 }}
    >
      {/*
        give a description to every radio element seperately
        */}
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          <CardSection>
            <Radio.Group
              label={t("Collection Type")}
              description={t(
                "check manual to add products one by one. check automated to add all existing products and future products that meet the conditions you set"
              )}
              value={collectionInfo.collectionType || "manual"}
              onChange={(e) => {
                onChangeHandler(e, "collectionType");

                if (e === "automated") {
                  setCollectionInfo(
                    (prevState: CollectionInfo): CollectionInfo => {
                      return {
                        ...prevState,
                        conditions: {
                          ...prevState.conditions,
                          conditionArray: [
                            {
                              value: "",
                              conditions: "$gt",
                              objectKey: "tag",
                              key: randomId(),
                            },
                          ],
                        },
                      };
                    }
                  );
                  return;
                }

                setCollectionInfo(
                  (prevState: CollectionInfo): CollectionInfo => {
                    return {
                      ...prevState,
                      conditions: {
                        ...prevState.conditions,
                        conditionArray: [],
                      },
                    };
                  }
                );
              }}
            >
              <Radio
                value="manual"
                label={t("Manual")}
                required
                checked={collectionInfo.collectionType === "manual"}
              />
              <Radio
                // value="automated"
                value=""
                label={t("Automated. later update")}
                required
                checked={false}
                // checked={collectionInfo.collectionType === "automated"}
              />
            </Radio.Group>
          </CardSection>

          <CollectionConditions
            onChangeHandler={onChangeHandler}
            collectionInfo={collectionInfo}
            setCollectionInfo={setCollectionInfo}
          />
        </Box>
      )}
    </Paper>
  );
};

export default TypeCard;
