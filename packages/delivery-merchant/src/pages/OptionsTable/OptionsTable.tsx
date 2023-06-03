import {
  Button,
  Card,
  Center,
  Checkbox,
  CloseButton,
  Container,
  NumberInput,
  Stack,
  Table,
  TextInput,
} from "hyfn-client";
import { randomId, useMediaQuery } from "@mantine/hooks";
import { useFixedComponent } from "contexts/fixedComponentContext/FixedComponentProvider";
import { t } from "utils/i18nextFix";

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useUpdateOptions } from "./hooks/updateOptions";

interface OptionsTableProps {}

const OptionsTable: React.FC<OptionsTableProps> = ({}) => {
  const location = useLocation();
  const { products } = location.state as { products: any[] };
  const [tableData, setTableData] = useState(products);
  const [, setFixedComponent] = useFixedComponent();

  const { mutate } = useUpdateOptions();
  const isXl = useMediaQuery("(min-width: 900px)");
  const isMobile = isXl === false;

  useEffect(() => {
    const fixedComponentConstructor = [
      () => (
        <Container
          sx={(theme) => ({
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            margin: " 4px auto ",
            borderRadius: "6px",
            height: "46px",
            width: isMobile ? "95%" : "50%",
          })}
        >
          <Button
            sx={{
              width: "100%",
            }}
            onClick={() => {
              mutate({ productsArray: tableData });
            }}
          >
            {t("Update")}
          </Button>
        </Container>
      ),
    ];

    setFixedComponent(fixedComponentConstructor);
  }, [setFixedComponent, tableData]);

  const addOption = ({ id }: { id: string }) => {
    setTableData(() => {
      return tableData.map((oldProduct) => {
        if (oldProduct.id === id) {
          return {
            ...oldProduct,
            options: {
              hasOptions: true,
              options: [
                ...oldProduct?.options?.options,
                {
                  minimumNumberOfOptionsForUserToSelect: 0,
                  maximumNumberOfOptionsForUserToSelect: 1,
                  isRequired: false,
                  optionName: "",
                  optionValues: [{ value: "", key: randomId(), price: 0 }],
                  key: randomId(),
                },
              ],
            },
          };
        }
        return oldProduct;
      });
    });
  };

  const addOptionValue = ({ id, key }: { id: string; key: string }) => {
    setTableData(() => {
      return tableData.map((oldProduct) => {
        if (oldProduct.id === id) {
          const newOptions = oldProduct.options.options.map((option) => {
            if (option.key === key) {
              return {
                ...option,
                optionValues: [
                  ...option.optionValues,
                  { value: "", key: randomId(), price: 0 },
                ],
              };
            }
            return option;
          });
          return {
            ...oldProduct,
            options: {
              hasOptions: true,
              options: newOptions,
            },
          };
        }
        return oldProduct;
      });
    });
  };

  const onOptionNameChangeHandler = ({
    value,
    key,
    id,
  }: {
    value: any;
    key: any;
    id: string;
  }) => {
    setTableData((prevState: any) => {
      return prevState.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const newOptions = product.options.options.map((option) => {
          if (option.key === key) {
            return { ...option, optionName: value };
          }
          return option;
        });

        return {
          ...product,
          id,
          options: {
            hasOptions: true,
            options: newOptions,
          },
        };
      });
    });
  };

  const deleteOption = ({ key, id }: { key: any; id: string }) => {
    setTableData((prevState: any) => {
      return prevState.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const newOptions = product.options.options.filter((option) => {
          return key !== option.key;
        });

        return {
          ...product,
          id,
          options: {
            hasOptions: true,
            options: newOptions,
          },
        };
      });
    });
  };

  const onMinimumNumberOfSelectableChangeHandler = ({
    value,
    key,
    id,
  }: {
    value: any;
    key: any;
    id: string;
  }) => {
    setTableData((prevState: any) => {
      return prevState.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const newOptions = product.options.options.map((option) => {
          if (option.key === key) {
            return {
              ...option,
              numberOfOptionsForUserToSelect: value,
            };
          }
          return option;
        });

        return {
          ...product,
          id,
          options: {
            hasOptions: true,
            options: newOptions,
          },
        };
      });
    });
  };
  const onMaximumNumberOfSelectableChangeHandler = ({
    value,
    key,
    id,
  }: {
    value: any;
    key: any;
    id: string;
  }) => {
    setTableData((prevState: any) => {
      return prevState.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const newOptions = product.options.options.map((option) => {
          if (option.key === key) {
            return {
              ...option,
              maximumNumberOfOptionsForUserToSelect: value,
            };
          }
          return option;
        });

        return {
          ...product,
          id,
          options: {
            hasOptions: true,
            options: newOptions,
          },
        };
      });
    });
  };

  const onIsRequiredChangeHandler = ({ key, id }: { key: any; id: string }) => {
    setTableData((prevState: any) => {
      return prevState.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const newOptions = product.options.options.map((option) => {
          if (option.key === key) {
            return {
              ...option,
              isRequired: !option.isRequired,
              minimumNumberOfOptionsForUserToSelect: !option.isRequired ? 1 : 0,
            };
          }
          return option;
        });

        return {
          ...product,
          id,
          options: {
            hasOptions: true,
            options: newOptions,
          },
        };
      });
    });
  };

  const onOptionValueChangeHandler = ({
    value,
    key,
    valueKey,
    id,
  }: {
    value: any;
    key: any;
    valueKey: any;
    id: string;
  }) => {
    setTableData((prevState: any) => {
      return prevState.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const newOptions = product.options.options.map((option) => {
          if (option.key === key) {
            const newOptionValues = option.optionValues.map((optionValue) => {
              if (optionValue.key === valueKey) {
                return {
                  ...optionValue,
                  value,
                };
              }
              return optionValue;
            });

            return {
              ...option,
              optionValues: newOptionValues,
            };
          }
          return option;
        });

        return {
          ...product,
          id,
          options: {
            hasOptions: true,
            options: newOptions,
          },
        };
      });
    });
  };

  const onOptionPriceChangeHandler = ({
    value,
    key,
    valueKey,
    id,
  }: {
    value: any;
    key: any;
    valueKey: any;
    id: string;
  }) => {
    setTableData((prevState: any) => {
      return prevState.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const newOptions = product.options.options.map((option) => {
          if (option.key === key) {
            const newOptionValues = option.optionValues.map((optionValue) => {
              if (optionValue.key === valueKey) {
                return {
                  ...optionValue,
                  price: value,
                };
              }
              return optionValue;
            });

            return {
              ...option,
              optionValues: newOptionValues,
            };
          }
          return option;
        });

        return {
          ...product,
          id,
          options: {
            hasOptions: true,
            options: newOptions,
          },
        };
      });
    });
  };

  return (
    <Container mb={64}>
      {tableData.map(({ id, ...rest }) => {
        return (
          <Card
            m={"14px auto"}
            sx={{
              overflowX: "scroll",
            }}
          >
            <Center>{rest?.textInfo?.title}</Center>
            <Container
              sx={{
                overflowX: "scroll",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {rest?.options?.options.map(({ key, ...option }) => {
                return (
                  <Stack
                    sx={{
                      overflowX: "scroll",
                    }}
                  >
                    <Table
                      sx={{
                        overflowX: "scroll",
                      }}
                    >
                      <thead>
                        <tr>
                          <td
                            style={{
                              minWidth: "40px",
                            }}
                          >
                            {t("Option name")}
                          </td>
                          <td
                            style={{
                              minWidth: "160px",
                            }}
                          >
                            {t("Maximum Selectable")}
                          </td>
                          {option.isRequired && (
                            <td
                              style={{
                                minWidth: "160px",
                              }}
                            >
                              {t("Minimum Selectable")}
                            </td>
                          )}
                          <td
                            style={{
                              minWidth: "60px",
                            }}
                          >
                            {t("Required")}
                          </td>
                          <td
                            style={{
                              minWidth: "140px",
                            }}
                          >
                            {t("Actions")}
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                          // style={{
                          //   minWidth: 'fit-content',
                          // }}
                          >
                            <TextInput
                              style={{
                                minWidth: "140px",
                              }}
                              value={option?.optionName}
                              onChange={(e) =>
                                onOptionNameChangeHandler({
                                  value: e.currentTarget.value,
                                  key,
                                  id,
                                })
                              }
                            />
                          </td>
                          <td
                            style={{
                              minWidth: "140px",
                            }}
                          >
                            <NumberInput
                              value={
                                option?.maximumNumberOfOptionsForUserToSelect
                              }
                              onChange={(e) =>
                                onMaximumNumberOfSelectableChangeHandler({
                                  value: e,
                                  key,
                                  id,
                                })
                              }
                            />
                          </td>
                          {option.isRequired && (
                            <td
                              style={{
                                minWidth: "140px",
                              }}
                            >
                              <NumberInput
                                value={
                                  option?.minimumNumberOfOptionsForUserToSelect
                                }
                                onChange={(e) =>
                                  onMinimumNumberOfSelectableChangeHandler({
                                    value: e,
                                    key,
                                    id,
                                  })
                                }
                              />
                            </td>
                          )}
                          <td
                            style={{
                              minWidth: "40px",
                            }}
                          >
                            <Checkbox
                              checked={option?.isRequired}
                              onChange={(e) =>
                                onIsRequiredChangeHandler({ key, id })
                              }
                            />
                          </td>
                          <td>
                            <CloseButton
                              onClick={() => {
                                deleteOption({ key, id });
                              }}
                            >
                              {t("Delete")}
                            </CloseButton>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <Table>
                      <thead>
                        <tr>
                          <td>{t("Value")}</td>
                          <td>{t("Added Price")}</td>
                          <td>{t("Actions")}</td>
                        </tr>
                      </thead>
                      <tbody>
                        {option.optionValues.map(
                          ({ key: valueKey, ...optionValue }) => {
                            const deleteOptionValue = () => {
                              setTableData((prevState: any) => {
                                return prevState.map((product) => {
                                  if (product.id !== id) {
                                    return product;
                                  }

                                  const newOptions =
                                    product.options.options.map((option) => {
                                      if (option.key === key) {
                                        const newOptionValues =
                                          option.optionValues.filter(
                                            (optionValue) => {
                                              return (
                                                optionValue.key !== valueKey
                                              );
                                            }
                                          );

                                        return {
                                          ...option,
                                          optionValues: newOptionValues,
                                        };
                                      }
                                      return option;
                                    });

                                  return {
                                    ...rest,
                                    id,
                                    options: {
                                      hasOptions: true,
                                      options: newOptions,
                                    },
                                  };
                                });
                              });
                            };
                            return (
                              <tr>
                                <td>
                                  <TextInput
                                    value={optionValue.value}
                                    onChange={(e) => {
                                      onOptionValueChangeHandler({
                                        value: e.currentTarget.value,
                                        key,
                                        valueKey,
                                        id,
                                      });
                                    }}
                                  />
                                </td>
                                <td>
                                  <NumberInput
                                    value={optionValue.price}
                                    onChange={(e) => {
                                      onOptionPriceChangeHandler({
                                        value: e,
                                        key,
                                        valueKey,
                                        id,
                                      });
                                    }}
                                  />
                                </td>
                                <td>
                                  <CloseButton
                                    onClick={() => deleteOptionValue()}
                                  >
                                    {t("Delete")}
                                  </CloseButton>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </Table>
                    <Button
                      fullWidth
                      sx={{
                        maxWidth: "300px",
                      }}
                      m={"12px auto"}
                      onClick={() => addOptionValue({ id, key })}
                    >
                      {t("Add Option value")}
                    </Button>
                  </Stack>
                );
              })}
            </Container>
            <Button
              fullWidth
              sx={{
                maxWidth: "400px",
              }}
              onClick={() => addOption({ id })}
            >
              {t("Add Option")}
            </Button>
          </Card>
        );
      })}
    </Container>
  );
};

export default OptionsTable;
