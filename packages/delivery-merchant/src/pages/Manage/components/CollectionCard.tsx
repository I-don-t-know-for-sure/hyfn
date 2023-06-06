import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  Header,
  Image,
  Loader,
  Paper,
  Select,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { t } from "utils/i18nextFix";
import { forwardRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGetCollections from "../hooks/useGetCollections";

import { ProductsCard } from "../types";
import Product from "./Product";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Text size="md"> {label}</Text>
    </div>
  )
);

interface CollectionCardProps extends ProductsCard {}

const CollectionCard: React.FC<CollectionCardProps> = ({
  onChangeHandler,
  productInfo,
  isLoading,
}) => {
  const [searchedTag, setSearchedTag] = useState("");
  const [searchText, setSearchText] = useState(productInfo.barcode);
  const [debouncedValue] = useDebouncedValue(searchText, 500, {
    leading: true,
  });

  const {
    data: collections,
    refetch: refetchCollections,
    isLoading: areCollectoinsLoading,
    isFetched: areCollectionsFetched,
    error: collectionsError,
  } = useGetCollections();

  const [products, setProducts] = useState([]);

  return (
    <>
      {isLoading ? (
        <Paper
          // sx={{ margin: 'auto' }}
          shadow="sm"
        >
          <Skeleton
            height={30}
            radius={"md"}
            //  m={4}
          />
          <Skeleton
            height={30}
            radius={"md"}
            //  m={4}
          />
        </Paper>
      ) : (
        <Paper
          // sx={{ margin: 'auto' }}
          shadow="sm"
        >
          <Container>
            <Stack>
              <Stack>
                <Title order={4}>
                  <Text>{t("Product status")}</Text>
                </Title>
                {isLoading ? (
                  <>
                    <Loader />
                  </>
                ) : (
                  <Group
                  // sx={{ height: 100 }}
                  >
                    <Checkbox
                      label={t("Active")}
                      checked={productInfo?.isActive || false}
                      onChange={(e) => {
                        const checked = e.currentTarget.checked;
                        onChangeHandler(checked, "isActive");
                      }}
                    />
                    <Checkbox
                      label={t("InActive")}
                      checked={!productInfo?.isActive || false}
                      onChange={(e) => {
                        const checked = !e.currentTarget.checked;
                        onChangeHandler(checked, "isActive");
                      }}
                    />
                  </Group>
                )}

                {isLoading ? (
                  <>
                    <Skeleton height={30} />
                  </>
                ) : (
                  <Select
                    itemComponent={SelectItem}
                    searchable
                    label={t("Collections")}
                    data={
                      collections?.length > 0 && areCollectionsFetched
                        ? collections?.filter((collection) => {
                            const isAlreadySelected =
                              productInfo.collections?.find(
                                (selectedCollection) =>
                                  collection.value === selectedCollection.value
                              );

                            return !isAlreadySelected;
                          })
                        : []
                    }
                    nothingFound={
                      <Button
                        variant="outline"
                        component={Link}
                        to={"/createcollection"}
                      >
                        {t("Add")} {searchedTag}
                      </Button>
                    }
                    placeholder={t("collection")}
                    onFocus={() => {
                      refetchCollections();
                    }}
                    maxDropdownHeight={400}
                    filter={(value, item) => {
                      setSearchedTag(value);
                      return item.label?.includes(value.toLowerCase().trim());
                    }}
                    onChange={(e) => {
                      const collection = collections?.find((collection) => {
                        return collection.value === e;
                      });
                      const selectedCollections =
                        productInfo.collections?.length > 0
                          ? productInfo.collections
                          : [];
                      onChangeHandler(
                        [...selectedCollections, collection],
                        "collections"
                      );
                    }}
                  />
                )}
                <Box>
                  {productInfo.collections?.map((collection) => {
                    return (
                      <Badge
                        rightSection={
                          <Button
                            size="xs"
                            variant="subtle"
                            onClick={() => {
                              const filteredCollections =
                                productInfo.collections.filter(
                                  (oldCollection) => {
                                    return (
                                      oldCollection.value !== collection.value
                                    );
                                  }
                                );
                              onChangeHandler(
                                filteredCollections,
                                "collections"
                              );
                            }}
                          >
                            X
                          </Button>
                        }
                      >
                        {collection.label}
                      </Badge>
                    );
                  })}
                </Box>
              </Stack>

              <Box
                sx={{
                  height: "300px",
                }}
              >
                {products.length > 0 && (
                  <Card shadow={"lg"}>
                    {products.map((product, index) => {
                      return (
                        <Box
                          key={index}
                          sx={(theme) => ({
                            borderRadius: "6px",

                            ["&:hover"]: {
                              backgroundColor:
                                theme.colorScheme === "dark"
                                  ? theme.colors.dark[5]
                                  : theme.colors.gray[0],
                            },
                            cursor: "pointer",
                          })}
                          mt={6}
                          onClick={() => {
                            onChangeHandler(product.images, "images");
                            onChangeHandler(
                              product.images,
                              "productLibraryImages"
                            );
                          }}
                        >
                          <Box
                            m={6}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Image
                              withPlaceholder
                              width={"30px"}
                              height={"30px"}
                              src={`${
                                import.meta.env.VITE_APP_BUCKET_URL
                              }/tablet/${product.images[0]}`}
                            />
                            <Text>{product.textInfo.title}</Text>
                          </Box>
                        </Box>
                      );
                    })}
                  </Card>
                )}
              </Box>
            </Stack>
          </Container>
        </Paper>
      )}
    </>
  );
};

export default CollectionCard;
