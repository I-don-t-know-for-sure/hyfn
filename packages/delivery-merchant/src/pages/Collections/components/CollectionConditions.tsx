import {
  Box,
  Button,
  CardSection,
  Container,
  Input,
  Radio,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import assert from "assert";
import { SelectItem } from "components/SelectIotem";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";
import { CollectionCard, CollectionInfo, Condition } from "../types";
const data = [
  {
    value: "$gt",
    label: t("is bigger than"),
  },
  {
    value: "$lt",
    label: t("is less than"),
  },
  {
    value: "$eq",
    label: t("is equal to"),
  },
  {
    value: "$ne",
    label: t("is not equal to"),
  },
];

const objectKeys = [
  {
    value: "pricing.price",
    label: t("price"),
  },
  {
    value: "textInfo.title",
    label: t("title"),
  },
  {
    value: "tag",
    label: t("tag"),
  },
  {
    value: "weight",
    label: t("weight"),
  },
];

interface CollectionconditionsProps extends CollectionCard {}

const CollectionConditions: React.FC<CollectionconditionsProps> = ({
  onChangeHandler,
  collectionInfo,
  setCollectionInfo,
}) => {
  const inputType = (condition: Condition) => {
    if (
      condition.objectKey === "weight" ||
      condition.objectKey === "pricing.price"
    )
      return "number";

    return "text";
  };
  const filteredConditions = data.filter((condition) => {
    return condition.value === "$eq";
  });
  const [type, setInputType] = useState<"text" | "number">("number");
  return (
    collectionInfo.collectionType === "automated" && (
      <>
        <Box mt={"md"}>
          <Radio.Group
            label="Collection Type"
            onChange={(e: CollectionInfo["conditions"]["mustMatch"]) => {
              setCollectionInfo((prevState: CollectionInfo): CollectionInfo => {
                return {
                  ...prevState,
                  conditions: {
                    ...prevState.conditions,
                    mustMatch: e,
                  },
                };
              });
            }}
            value={collectionInfo?.conditions?.mustMatch || "$or"}
          >
            <Radio
              value="$and"
              label={t("All Conditions")}
              checked={collectionInfo?.conditions?.mustMatch === "$and"}
            />
            <Radio
              value="$or"
              label={t("Any Condition")}
              checked={collectionInfo.conditions?.mustMatch === "$or"}
            />
          </Radio.Group>
        </Box>
        <Box mt={"md"}>
          {collectionInfo.conditions?.conditionArray?.map((condition) => (
            <Box key={condition.key}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Select
                    defaultValue={objectKeys[0].value}
                    data={objectKeys}
                    itemComponent={SelectItem}
                    onChange={(e: Condition["objectKey"]) => {
                      const updatedConditions =
                        collectionInfo.conditions.conditionArray.map(
                          (oldConditions) => {
                            if (oldConditions.key !== condition.key)
                              return oldConditions;
                            return { ...condition, objectKey: e };
                          }
                        );

                      setCollectionInfo(
                        (prevState: CollectionInfo): CollectionInfo => {
                          return {
                            ...prevState,
                            conditions: {
                              ...prevState.conditions,
                              conditionArray: updatedConditions,
                            },
                          };
                        }
                      );
                      setInputType(inputType({ ...condition, objectKey: e }));
                    }}
                  />
                  {/*
                  BUG deselect when the objectkey changes
                  */}
                  <Select
                    data={type === "number" ? data : filteredConditions}
                    itemComponent={SelectItem}
                    onChange={(e: Condition["conditions"]) => {
                      const updatedConditions =
                        collectionInfo.conditions.conditionArray.map(
                          (oldConditions) => {
                            if (oldConditions.key !== condition.key)
                              return oldConditions;
                            return { ...condition, condition: e };
                          }
                        );
                      setCollectionInfo(
                        (prevState: CollectionInfo): CollectionInfo => {
                          return {
                            ...prevState,
                            conditions: {
                              ...prevState.conditions,
                              conditionArray: updatedConditions,
                            },
                          };
                        }
                      );
                    }}
                  />
                </Box>
                <Input
                  type={type}
                  value={condition.value || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.currentTarget.value;
                    const updatedConditions =
                      collectionInfo.conditions.conditionArray.map(
                        (oldCondition) => {
                          if (oldCondition.key !== condition.key)
                            return oldCondition;

                          return {
                            ...condition,
                            value: value,
                          };
                        }
                      );

                    setCollectionInfo(
                      (prevState: CollectionInfo): CollectionInfo => {
                        return {
                          ...prevState,
                          conditions: {
                            ...prevState.conditions,
                            conditionArray: updatedConditions,
                          },
                        };
                      }
                    );
                  }}
                />
              </Box>
              <Box>
                <Button
                  variant="filled"
                  onClick={() => {
                    setCollectionInfo(
                      (prevState: CollectionInfo): CollectionInfo => {
                        const updatedConditions =
                          collectionInfo.conditions.conditionArray.filter(
                            (oldCondition) => {
                              return oldCondition.key !== condition.key;
                            }
                          );
                        return {
                          ...prevState,
                          conditions: {
                            ...prevState.conditions,
                            conditionArray: [...updatedConditions],
                          },
                        };
                      }
                    );
                  }}
                >
                  {t("Delete")}
                </Button>
              </Box>
            </Box>
          ))}
          <Container p={12}>
            <Button
              variant="outline"
              onClick={() => {
                setCollectionInfo(
                  (prevState: CollectionInfo): CollectionInfo => {
                    return {
                      ...prevState,
                      conditions: {
                        ...prevState.conditions,
                        conditionArray: [
                          ...prevState.conditions.conditionArray,
                          {
                            value: "",
                            conditions: "$gt",
                            objectKey: "pricing.price",
                            key: randomId(),
                          },
                        ],
                      },
                    };
                  }
                );
              }}
            >
              {t("Add Condition")}
            </Button>
          </Container>
        </Box>
      </>
    )
  );
};

export default CollectionConditions;
