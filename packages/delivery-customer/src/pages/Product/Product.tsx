import {
  ActionIcon,
  AspectRatio,
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Divider,
  Group,
  Loader,
  MultiSelect,
  Paper,
  Space,
  Text,
} from "@mantine/core";
import { ImageModal } from "hyfn-client";
import { useCart } from "../../contexts/cartContext/Provider";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { randomId } from "@mantine/hooks";
import Image from "../../components/Image";
import { useFixedComponent } from "../../contexts/fixedComponentContext/FixedComponentProvider";
import { t } from "../../util/i18nextFix";
import { useGetProduct } from "./hooks/useGetProduct";
import { storeServiceFee } from "../../config/constents";
import { useImage } from "contexts/imageContext/ImageProvider";

interface ProductProps {}

const Product: React.FC<ProductProps> = ({}) => {
  const { storefront, country, city, productId } = useParams<{
    storefront: string;
    country: string;
    city: string;
    productId: string;
  }>();

  // const { orderType } = state as { orderType: string };
  const [product, setProduct] = useState<any>();
  const [storeDoc, setStore] = useState<any>();
  const [productOrder, setProductOrder] = useState<{
    instructions: string;
    options: {
      optionName: string;
      optionValues: { value: string; key: string; price: string }[];
      key: string;
    }[];
  }>({
    instructions: "",
    options: [],
  });
  console.log("🚀 ~ file: Product.tsx:44 ~ productOrder:", productOrder);

  const [checkboxError, setCheckboxError] = useState([]);
  const { data, isLoading, isFetched, isError, error } = useGetProduct(
    { storefront, city, country, productId },
    true
  );

  const [, setFixedComponent] = useFixedComponent() as any;

  const {
    setCartInfo,
    addProductWithOptionsToCart,
    updateProductWithOptions,
    removeProductWithOptionsFromCart,
    cart,
  } = useCart();

  const orderType = cart[storefront]?.orderType
    ? cart[storefront]?.orderType
    : "Delivery";
  const productFromCart = Array.isArray(
    cart[storefront]?.addedProducts[productId]
  )
    ? cart[storefront]?.addedProducts[productId]
    : cart[storefront]?.addedProducts[productId] !== undefined
    ? [cart[storefront]?.addedProducts[productId]]
    : undefined;
  const { url, screenSizes } = useImage();
  const [editing, setEditing] = useState(false);
  const [qty, setQty] = useState(1);
  const [editingProduct, setEditingProduct] = useState<any>();
  const resetOrder = () => {
    setProductOrder({
      instructions: "",
      options: [],
    });
    setCheckboxError([]);
    setQty(1);
    setEditing(false);
  };
  useEffect(() => {
    if (data && !isLoading && !editing) {
      setProduct(data.product);
      setStore(data.storeDoc);
    }
  }, [isFetched, editing, productId, isLoading, data]);

  const addProduct = () => {
    const check = didSelectOptions();

    if (check) {
      addProductWithOptionsToCart(
        storeDoc,
        { ...product, ...productOrder, qty, key: randomId() },
        setCartInfo,
        city,
        country,
        orderType
      );

      resetOrder();
      return;
    }
    // showNotification({ message: 'wrong', color: 'red' });
  };

  const didSelectOptions = () => {
    // const allOptionsOptional = product.options.options.some((option) => option.isRequired)
    const didNotMeetRules = product.options.options.some((option) => {
      const productOrderOptions = productOrder.options.find(
        (productOrderOption) => {
          return productOrderOption.key === option.key;
        }
      );

      console.log(
        "🚀 ~ file: Product.tsx:113 ~ didNotMeetRules ~ productOrderOptions:",
        productOrderOptions
      );
      if (!productOrderOptions && !option.isRequired) {
        console.log("ndjcndjcnj", option);
        return false;
      }
      if (productOrderOptions && !option.isRequired) {
        console.log("ndjcndjcnj", option);
        return false;
      }

      if (!productOrderOptions && option.isRequired) {
        console.log("ndjcndjcnj", option);

        setCheckboxError([{ key: option.key }]);

        return true;
      }
      if (option.isRequired) {
        console.log("ndjcndjcnj", option);
        if (
          productOrderOptions.optionValues.length <=
            option.maximumNumberOfOptionsForUserToSelect &&
          productOrderOptions.optionValues.length ===
            option.minimumNumberOfOptionsForUserToSelect
        ) {
          console.log("ndjcndjcnj", option);
          return false;
        }
      }
      console.log("ndjcndjcnj", option);
      setCheckboxError([{ key: option.key }]);
      return true;
    });
    return !didNotMeetRules;
    // if (productOrder.options.length === 0) {
    //   return false;
    // }
    // const check = productOrder.options.some((option) => {
    //   if (option.optionValues.length > 0) {
    //     return true;
    //   }
    // });
    // return check;
  };

  const updateProduct = () => {
    const check = didSelectOptions();

    // const {key, ...rest} = productOrder
    if (check) {
      updateProductWithOptions(
        storeDoc,
        {
          ...editingProduct,
          ...productOrder,
          // ...rest,
          qty,
        },
        setCartInfo
        // productId,
      );
      resetOrder();
      return;
    }
  };

  const removeProduct = () => {
    removeProductWithOptionsFromCart(
      storeDoc,
      { ...editingProduct, qty },
      setCartInfo
    );
  };

  const decreaseQTY = () => {
    if (checkboxError.length > 0) {
      // setCheckboxError([]);
    }
    setQty((qty) => (qty > 1 ? qty - 1 : qty));
  };
  const increaseQTY = () => {
    if (checkboxError.length > 0) {
      // setCheckboxError([]);
    }
    setQty((qty) => qty + 1);
  };

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
            border: `1px solid ${theme.primaryColor}`,
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          })}
        >
          <Box
            sx={{
              display: "flex",
              width: editing ? "25%" : "200px",
              justifyContent: "space-between",
            }}
          >
            <ActionIcon size={24} variant="outline" sx={{}}>
              <AiOutlineMinus onClick={decreaseQTY} />
            </ActionIcon>
            <Text>{qty}</Text>
            <ActionIcon size={24} variant="outline">
              <AiOutlinePlus onClick={increaseQTY} />
            </ActionIcon>
          </Box>
          <Box
            sx={{
              width: editing ? "70%" : "initail",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              compact
              m={"auto 4px"}
              onClick={editing ? updateProduct : addProduct}
            >
              {editing ? "Save" : "Add To Cart"}
            </Button>
            {editing && (
              <>
                {" "}
                <Button compact m={"auto 4px"} onClick={resetOrder}>
                  {t("Cancel")}
                </Button>
                <Button
                  compact
                  m={"auto 4px"}
                  onClick={() => {
                    removeProduct();
                    resetOrder();
                  }}
                >
                  {t("Remove")}
                </Button>
              </>
            )}
          </Box>
        </Container>
      ),
    ];

    setFixedComponent(fixedComponentConstructor);
  }, [
    editing,
    qty,
    productOrder,
    setFixedComponent,
    data,
    isLoading,
    product,
    checkboxError,
  ]);

  if (isError) {
    return <Text>{error as any}</Text>;
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    product && (
      <Container
        sx={{
          marginBottom: "56px",
        }}
      >
        <Box>
          <ImageModal src={`${url}${screenSizes[0]}/${product.images[0]}`} />
          {/* <AspectRatio
            ratio={500 / 500}
            sx={(theme) => ({
              maxWidth: 500,
              borderRadius: '6px',
              maxHeight: 500,
              [theme.fn.largerThan('sm')]: {
                maxWidth: 300,
                maxHeight: 300,
              },
            })}
            mx="auto"
          >
            <Image
              radius={6}
              sx={{
                width: '100%',

                height: '100px',
              }}
              imageName={product?.images?.length > 0 ? product.images[0] : 'c72e349a9bc184cbdcfb1386060d4b5b'}
            />
          </AspectRatio> */}
          <Container>
            <Text
              sx={{
                fontSize: "28px",
              }}
            >
              {product.textInfo.title}
            </Text>
            <Text>{product.textInfo.description}</Text>
            <Text
              sx={{
                fontSize: "24px",
              }}
            >
              {`${storeDoc?.currency || "LYD"} ${
                product.pricing.price - product.pricing.price * storeServiceFee
              }`}
            </Text>
          </Container>
          <Space h={12} />
          <Box>
            {productFromCart &&
              productFromCart?.map((order) => {
                return (
                  <Container
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <Box>
                      {order.qty}X {t("in your cart")}
                    </Box>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setProductOrder({
                          instructions: order.instructions,
                          options: order.options,
                        });
                        setEditingProduct(order);
                        setQty(order.qty);
                        setEditing(true);
                      }}
                    >
                      {t("Edit")}
                    </Button>
                  </Container>
                );
              })}
          </Box>
        </Box>
        {product.options?.options?.map((option, index) => {
          return (
            <Paper
              key={index}
              sx={{
                margin: "12px auto",
              }}
            >
              <Divider />
              <Box
                sx={{
                  margin: "12px auto",
                }}
              >
                <Group
                  sx={{
                    justifyContent: "space-around",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  ></div>
                </Group>

                <Container
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MultiSelect
                    error={
                      !!checkboxError.find((optionError) => {
                        return optionError.key === option.key;
                      })
                    }
                    styles={{ label: { display: "flex" } }}
                    // variant="filled"
                    description={
                      <Text>{`${t(
                        `Select up to ${option.maximumNumberOfOptionsForUserToSelect}`
                      )} ${t("and")} ${
                        option.isRequired &&
                        t(
                          `at least  ${option.minimumNumberOfOptionsForUserToSelect}`
                        )
                      }`}</Text>
                    }
                    label={<Text size={24}>{option.optionName}</Text>}
                    required={option?.isRequired as boolean}
                    dropdownPosition="top"
                    // selectOnBlur
                    value={convertProductOrderOptionsValuesToSelectValueArray({
                      optionValues: productOrder?.options?.find(
                        (productOption) => option.key === productOption.key
                      )?.optionValues,
                    })}
                    data={convertProductOrderOptionsValuesToSelectArray({
                      optionValues: option?.optionValues,
                    })}
                    onChange={(e) => {
                      const newValues = e.map((newValue) => {
                        const valueArray = newValue.split(",");

                        return {
                          value: valueArray[0],
                          key: valueArray[1],
                          price: valueArray[2],
                        };
                      });

                      setProductOrder((prevState) => {
                        console.log(
                          "🚀 ~ file: Product.tsx:419 ~ setProductOrder ~ newValues:",
                          newValues
                        );
                        console.log(
                          "🚀 ~ file: Product.tsx:426 ~ setProductOrder ~ prevState:",
                          prevState
                        );
                        if (prevState.options.length === 0) {
                          return {
                            ...prevState,
                            options: [
                              {
                                key: option.key,
                                optionName: option.optionName,
                                optionValues: newValues,
                              },
                            ],
                          };
                        }
                        const isOptionAlreadySelected = prevState.options.find(
                          (oldOption) => option.key === oldOption.key
                        );
                        console.log(
                          "🚀 ~ file: Product.tsx:425 ~ setProductOrder ~ isOptionAlreadySelected:",
                          isOptionAlreadySelected
                        );
                        if (!isOptionAlreadySelected) {
                          return {
                            ...prevState,
                            options: [
                              ...prevState.options,
                              {
                                key: option.key,
                                optionName: option.optionName,
                                optionValues: newValues,
                              },
                            ],
                          };
                        }
                        if (isOptionAlreadySelected) {
                          const newOptions = prevState.options.map(
                            (oldOptions, place) => {
                              if (oldOptions.key === option.key) {
                                const optionInProductDocument =
                                  product.options.options.find(
                                    (productOption) => {
                                      return productOption.key === option.key;
                                    }
                                  );

                                if (
                                  newValues.length >
                                  optionInProductDocument.maximumNumberOfOptionsForUserToSelect
                                ) {
                                  return oldOptions;
                                }

                                return {
                                  key: option.key,
                                  optionName: option.optionName,
                                  optionValues: newValues,
                                };
                              }
                              return oldOptions;
                            }
                          );
                          console.log(
                            "🚀 ~ file: Product.tsx:458 ~ newOptions ~ newOptions:",
                            newOptions
                          );

                          return {
                            ...prevState,
                            instructions: prevState.instructions,
                            options: newOptions,
                          };
                        }
                      });
                    }}
                  />
                </Container>
              </Box>
              <Divider />
            </Paper>
          );
        })}
      </Container>
    )
  );
};

export default Product;

const convertProductOrderOptionsValuesToSelectArray = ({
  optionValues,
}: {
  optionValues: any;
}) => {
  return optionValues?.map((value) => {
    return {
      label: value?.value,
      value: `${value.value},${value.key},${value.price}`,
    };
  });
};
const convertProductOrderOptionsValuesToSelectValueArray = ({
  optionValues,
}: {
  optionValues: any;
}) => {
  return optionValues?.map((value) => {
    return `${value.value},${value.key},${value.price}`;
  });
};