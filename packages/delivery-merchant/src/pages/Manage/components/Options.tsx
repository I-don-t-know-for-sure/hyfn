import {
  Box,
  Button,
  Card,
  CardSection,
  Center,
  Checkbox,
  CloseButton,
  Group,
  NumberInput,
  Table,
  TextInput,
  ThemeIcon,
} from "hyfn-client";
import { randomId } from "@mantine/hooks";
import { t } from "utils/i18nextFix";
import React from "react";
import { stableValueHash } from "react-query/types/core/utils";
import { Option, ProductInfo, ProductsCard } from "../types";

interface OptionsProps extends ProductsCard {
  setProductInfo: any;
}

const Options: React.FC<OptionsProps> = ({
  onChangeHandler,
  productInfo,
  setProductInfo,
}) => {
  const handleOnBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    optionValue: { value: string; key: string },
    value: Option
  ) => {
    const newValue = e.currentTarget.value;
    const isNewValueEmpty = !newValue.replace(/\s+/g, "").length;
    const isPrevValueEmpty = !optionValue.value.replace(/\s+/g, "").length;

    if (isNewValueEmpty && isPrevValueEmpty) {
      setProductInfo((prevState: ProductInfo): ProductInfo => {
        const updatedOptions = productInfo.options.map((option) => {
          if (option.key !== value.key) return option;
          const newOptionValues = value.optionValues.map((oldOptionValue) => {
            if (optionValue.key !== oldOptionValue.key) return oldOptionValue;
            return {
              ...optionValue,
              value: "value",
              price: 0,
            };
          });
          return {
            ...value,
            optionValues: [...newOptionValues],
          };
        });

        return {
          ...prevState,
          options: updatedOptions,
        };
      });
    }
  };

  const handleOptionNameChaneg = (
    e: React.ChangeEvent<HTMLInputElement> | any,
    productInfo: ProductInfo,
    value: Option
  ) => {
    const newName = e.currentTarget.value;
    const newOptions = productInfo.options.map((option) => {
      if (option.key !== value.key) return option;
      return { ...value, optionName: newName };
    });
    setProductInfo((prevState: ProductInfo): ProductInfo => {
      return {
        ...prevState,
        options: newOptions,
      };
    });
  };

  const handleMaximumSelectableOptionsChange = (
    newSelectableCount: number,
    productInfo: ProductInfo,
    value: Option
  ) => {
    const newOptions = productInfo.options.map((option) => {
      if (option.key !== value.key) return option;
      const optionValuesLength = option.optionValues.length;
      const theNewCount =
        newSelectableCount > optionValuesLength
          ? optionValuesLength
          : newSelectableCount < 1
          ? 1
          : newSelectableCount;
      const minimumNumberOfOptionsForUserToSelect =
        // newSelectableCount >= option.minimumNumberOfOptionsForUserToSelect
        true
          ? option.minimumNumberOfOptionsForUserToSelect
          : newSelectableCount;
      return {
        ...value,
        maximumNumberOfOptionsForUserToSelect: theNewCount,
        minimumNumberOfOptionsForUserToSelect,
      };
    });
    setProductInfo((prevState: ProductInfo): ProductInfo => {
      return {
        ...prevState,
        options: newOptions,
      };
    });
  };
  const handleMinimumSelectableOptionsChange = (
    newSelectableCount: number,
    productInfo: ProductInfo,
    value: Option
  ) => {
    const newOptions = productInfo.options.map((option) => {
      if (option.key !== value.key) return option;

      const optionValuesLength = option.optionValues.length;
      const theNewCount =
        newSelectableCount > optionValuesLength
          ? optionValuesLength
          : newSelectableCount < 1
          ? 1
          : newSelectableCount;
      const maximumNumberOfOptionsForUserToSelect =
        // option.maximumNumberOfOptionsForUserToSelect >= newSelectableCount
        true
          ? option.maximumNumberOfOptionsForUserToSelect
          : newSelectableCount;
      return {
        ...value,
        minimumNumberOfOptionsForUserToSelect: theNewCount,
        maximumNumberOfOptionsForUserToSelect,
      };
    });
    setProductInfo((prevState: ProductInfo): ProductInfo => {
      return {
        ...prevState,
        options: newOptions,
      };
    });
  };

  const handleIsRequiredChange = (productInfo: ProductInfo, value: Option) => {
    const newOptions = productInfo.options.map((option) => {
      if (option.key !== value.key) return option;

      return {
        ...value,
        isRequired: !value.isRequired,
        minimumNumberOfOptionsForUserToSelect: !value.isRequired ? 1 : 0,
      };
    });
    setProductInfo((prevState: ProductInfo): ProductInfo => {
      return {
        ...prevState,
        options: newOptions,
      };
    });
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productInfo: ProductInfo,
    optionValue: { value: string; key: string; price: number },
    value: Option,
    index: number
  ) => {
    const newValue = e.currentTarget.value;
    const isNewValueEmpty = !newValue.replace(/\s+/g, "").length;
    const isPrevValueEmpty = !optionValue.value.replace(/\s+/g, "").length;

    if (
      !isNewValueEmpty &&
      isPrevValueEmpty &&
      index === value.optionValues.length - 1
    ) {
      setProductInfo((prevState: ProductInfo): ProductInfo => {
        const updatedOptions = productInfo.options.map((option) => {
          if (option.key !== value.key) return option;
          const newOptionValues = value.optionValues.map((oldOptionValue) => {
            if (optionValue.key !== oldOptionValue.key) return oldOptionValue;
            return {
              ...optionValue,
              value: newValue,
            };
          });
          return {
            ...value,
            optionValues: [...newOptionValues],
          };
        });

        return {
          ...prevState,
          options: updatedOptions,
        };
      });
      return;
    }

    const updatedOptions = productInfo.options.map((option) => {
      if (option.key !== value.key) return option;
      const newOptionValues = value.optionValues.map((oldOptionValue) => {
        if (optionValue.key !== oldOptionValue.key) return oldOptionValue;
        return { ...optionValue, value: newValue };
      });
      return { ...value, optionValues: newOptionValues };
    });
    setProductInfo((prevState: ProductInfo): ProductInfo => {
      return {
        ...prevState,
        options: updatedOptions,
      };
    });
  };

  const handleOptionValuePriceChange = (
    e: number,
    productInfo: ProductInfo,
    optionValue: { value: string; key: string; price: number },
    value: Option,
    index: number
  ) => {
    const newValue = e;

    setProductInfo((prevState: ProductInfo): ProductInfo => {
      const updatedOptions = productInfo.options.map((option) => {
        if (option.key !== value.key) return option;
        const newOptionValues = value.optionValues.map((oldOptionValue) => {
          if (optionValue.key !== oldOptionValue.key) return oldOptionValue;
          return {
            ...optionValue,

            price: e,
          };
        });
        return {
          ...value,
          optionValues: [...newOptionValues],
        };
      });

      return {
        ...prevState,
        options: updatedOptions,
      };
    });

    // const updatedOptions = productInfo.options.options.map((option) => {
    //   if (option.key !== value.key) return option;
    //   const newOptionValues = value.optionValues.map((oldOptionValue) => {
    //     if (optionValue.key !== oldOptionValue.key) return oldOptionValue;
    //     return { ...optionValue, value: newValue };
    //   });
    //   return { ...value, optionValues: newOptionValues };
    // });
    // setProductInfo((prevState: ProductInfo): ProductInfo => {
    //   return {
    //     ...prevState,
    //     options: {
    //       ...prevState.options,
    //       options: updatedOptions,
    //     },
    //   };
    // });
  };

  const handleOnDelete = (
    productInfo: ProductInfo,
    optionValue: { value: string; key: string },
    value: Option
  ) => {
    const updatedOptions = productInfo.options.map((option) => {
      if (option.key !== value.key) return option;
      const newOptionValues = value.optionValues.filter((oldOptionValue) => {
        return optionValue.key !== oldOptionValue.key;
      });

      return { ...value, optionValues: newOptionValues };
    });
    setProductInfo((prevState: ProductInfo): ProductInfo => {
      return {
        ...prevState,
        options: updatedOptions,
      };
    });
  };

  const handleOptionDelete = (
    productInfo: ProductInfo,

    value: Option
  ) => {
    if (productInfo?.options?.length === 1) {
      setProductInfo((prevState: ProductInfo): ProductInfo => {
        return {
          ...prevState,
          hasOptions: false,

          options: [],
        };
      });
    }
    const updatedOptions = productInfo.options.filter((option) => {
      return option.key !== value.key;
    });
    setProductInfo((prevState: ProductInfo): ProductInfo => {
      return {
        ...prevState,
        options: updatedOptions,
      };
    });
  };

  console.log("🚀 ~ file: Options.tsx:321 ~ options:", productInfo.options);
  if (productInfo.hasOptions && productInfo.options) {
    return (
      <Box>
        {productInfo.options?.map((value) => (
          <Card.Section
            sx={{
              minHeight: "230px",
              overflowX: "scroll",
              margin: "12px auto",
            }}
            key={value.key}
          >
            <Group
              grow
              align={"center"}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                label={t("Option Name")}
                sx={{
                  minWidth: "60px",
                  // maxWidth: '100px',
                }}
                required
                value={value?.optionName || ""}
                onChange={(e) => {
                  handleOptionNameChaneg(e, productInfo, value);
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "end",
                }}
              >
                <NumberInput
                  m={"auto 2px"}
                  hideControls
                  required
                  label={t("Maximum Selectable")}
                  sx={{
                    minWidth: "150px",

                    // maxWidth: '200px',
                  }}
                  min={
                    value.isRequired
                      ? value.minimumNumberOfOptionsForUserToSelect
                      : value.optionValues.length
                  }
                  max={value?.optionValues?.length}
                  // sx={{
                  //   maxWidth: "165px",
                  // }}
                  value={value?.maximumNumberOfOptionsForUserToSelect}
                  onChange={(e) => {
                    handleMaximumSelectableOptionsChange(
                      e as number,
                      productInfo,
                      value
                    );
                  }}
                />
                {value.isRequired && (
                  <NumberInput
                    m={"auto 2px"}
                    hideControls
                    required
                    label={t("Minimum Selectable")}
                    sx={{
                      minWidth: "150px",
                      // maxWidth: '200px',
                    }}
                    min={1}
                    max={value.maximumNumberOfOptionsForUserToSelect}
                    // sx={{
                    //   maxWidth: "165px",
                    // }}
                    value={value?.minimumNumberOfOptionsForUserToSelect}
                    onChange={(e) => {
                      handleMinimumSelectableOptionsChange(
                        e as number,
                        productInfo,
                        value
                      );
                    }}
                  />
                )}
                <Checkbox
                  styles={(theme) => ({
                    body: {
                      display: "flex",
                      flexDirection: "column-reverse",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: "100%",
                    },
                  })}
                  // ml={6}
                  // mb={8}
                  size={"md"}
                  label={t("Required")}
                  checked={value.isRequired}
                  onChange={() => {
                    handleIsRequiredChange(productInfo, value);
                  }}
                />

                <CloseButton
                  // m={'auto '}
                  // sx={{
                  //   cursor: 'pointer',
                  // }}

                  size="md"
                  onClick={() => {
                    handleOptionDelete(productInfo, value);
                  }}
                  variant="subtle"
                >
                  {t("X")}
                </CloseButton>
              </Box>
            </Group>
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Table
                sx={{
                  width: "100%",
                }}
              >
                <thead>
                  <tr>
                    <th>{t("Option Values")}</th>
                    <th>{t("Added cost")}</th>
                    <th>{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {value.optionValues.map((optionValue, index) => (
                    <tr>
                      <td>
                        <TextInput
                          required
                          sx={{ width: "100%", padding: "0px 10px 0px 0px" }}
                          onBlur={(e) => {
                            handleOnBlur(e, optionValue, value);
                          }}
                          value={optionValue?.value || ""}
                          key={optionValue.key}
                          onChange={(e) => {
                            handleOnChange(
                              e,
                              productInfo,
                              optionValue,
                              value,
                              index
                            );
                          }}
                        />
                      </td>
                      <td>
                        <NumberInput
                          sx={{}}
                          required
                          value={optionValue?.price}
                          key={optionValue.key}
                          onChange={(e) => {
                            handleOptionValuePriceChange(
                              e as number,
                              productInfo,
                              optionValue,
                              value,
                              index
                            );
                          }}
                        />
                      </td>
                      <td>
                        <CloseButton
                          // m={'auto 6px'}
                          size="md"
                          onClick={() => {
                            handleOnDelete(productInfo, optionValue, value);
                          }}
                        ></CloseButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Center>
                <Button
                  fullWidth
                  sx={{
                    maxWidth: 300,
                  }}
                  onClick={() => {
                    setProductInfo((prevState) => {
                      const updatedOptions = productInfo.options.map(
                        (option) => {
                          if (option.key !== value.key) return option;

                          return {
                            ...value,
                            optionValues: [
                              ...option.optionValues,
                              { value: "", key: randomId(), price: 0 },
                            ],
                          };
                        }
                      );
                      return {
                        ...prevState,

                        options: updatedOptions,
                      };
                    });
                  }}
                >
                  {t("Add value")}
                </Button>
              </Center>
            </Box>
          </Card.Section>
        ))}
        <Center>
          <Button
            fullWidth
            sx={{
              maxWidth: 400,
            }}
            onClick={() =>
              setProductInfo((prevState: ProductInfo): ProductInfo => {
                return {
                  ...prevState,

                  options: [
                    ...prevState.options,
                    {
                      minimumNumberOfOptionsForUserToSelect: 0,
                      maximumNumberOfOptionsForUserToSelect: 1,
                      isRequired: false,
                      optionName: "",
                      key: randomId(),
                      optionValues: [{ value: "", key: randomId(), price: 0 }],
                    },
                  ],
                };
              })
            }
          >
            {t("add more")}
          </Button>
        </Center>
      </Box>
    );
  }

  return null;
};

export default Options;
