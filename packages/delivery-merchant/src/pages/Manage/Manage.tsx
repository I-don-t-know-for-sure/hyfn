import {
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Group,
  Loader,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  UnstyledButton
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

import { t } from "utils/i18nextFix";
import { useEffect, useState } from "react";

import { InfiniteData } from "react-query";

import { Link, useNavigate } from "react-router-dom";
import BulkImportModal from "./components/BulkImportModal";

import DuplicateModal from "./components/DuplicateModal";
import { useDeleteProduct } from "./hooks/useDeleteProduct";
import { useGetProducts } from "./hooks/useGetProductsForBulkUpdate";
import { useSearchProducts } from "./hooks/useSearchProducts";
import Test from "./components/Text";

import { useRemoveProductsBackgrounds } from "./hooks/useRemoveBackground";
import { fetchApi } from "utils/fetch";
import { productTabsObject } from "hyfn-types";
// import { Helmet } from 'react-helmet'

const ManageProducts: React.FC = () => {
  const [lastDocId] = useState();
  const [filterText, setFilterText] = useState("");
  const [checkedFilter, setCheckedFilter] = useState<any>("all");
  const navigate = useNavigate();
  const { mutate: removeBackgounds } = useRemoveProductsBackgrounds();

  const { data, isLoading, isError, fetchNextPage, error } = useGetProducts({
    lastDocId,
    check: checkedFilter
    // filterText
  });

  const { data: searchResults, isLoading: areResultsLoading } =
    useSearchProducts({ searchValue: filterText, filter: checkedFilter });
  const [results, setResults] = useState<any[]>([]);
  const { mutate } = useDeleteProduct();

  useEffect(() => {
    setSelectedProducts([]);
  }, [checkedFilter]);

  useEffect(() => {
    if (!filterText && data?.pages[data?.pages?.length - 1]) {
      const flatData = data?.pages.reduce((acc, page) => {
        return [...acc, ...page];
      }, []);

      setResults(flatData);
    }
    if (filterText && searchResults?.pages[searchResults?.pages?.length - 1]) {
      const searchResultsArray = searchResults.pages.flatMap((page) => page);
      setResults(searchResultsArray);
    }
  }, [filterText, data, searchResults, isLoading, areResultsLoading]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const length = data?.pages?.reduce((accu, crr) => {
    return accu + crr?.length;
  }, 0);
  return (
    <Container>
      <Stack>
        {/* <Helmet>
        <title>{t('Products')}</title>
      </Helmet> */}

        <Group position="apart">
          <Text>{t("Products")}</Text>
          <Group position="center">
            <BulkImportModal />

            <Button component={Link} to={"/product"}>
              {t("Create Product")}
            </Button>
          </Group>
        </Group>

        <Card shadow="xl">
          <Tabs defaultValue={"all"} onTabChange={setCheckedFilter}>
            <Tabs.List>
              <Tabs.Tab value={productTabsObject.all}>{t("All")}</Tabs.Tab>

              <Tabs.Tab value={productTabsObject.active}>
                {t("Active")}
              </Tabs.Tab>
              <Tabs.Tab value={productTabsObject.inactive}>
                {t("Inactive")}
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <Group grow>
            <TextInput
              m={"8px auto"}
              placeholder={t("Search for products")}
              value={filterText}
              onChange={(e) => {
                setFilterText(e.currentTarget.value);
              }}
            />
          </Group>
          {isError ? (
            <Text>{JSON.stringify(error)}</Text>
          ) : (
            <Container>
              {selectedProducts.length > 0 && (
                <Group>
                  <Text>{`${t("Selected")}  ${selectedProducts.length}`}</Text>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={async () => {
                      const products = await fetchApi({
                        arg: [{ products: selectedProducts }],
                        url: `getProductsForBulkUpdate`
                      });
                      navigate("/bulkupdate", {
                        replace: true,
                        state: { products }
                      });
                    }}>
                    {t("Bulk Update")}
                  </Button>

                  <Button
                    variant="outline"
                    size="xs"
                    component={Link}
                    to="/optionstable"
                    state={{ products: selectedProducts }}>
                    {t("Options")}
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      removeBackgounds({ productIds: selectedProducts });
                    }}>
                    {t("Remove image backgrounds")}
                  </Button>
                  {selectedProducts.length === 1 && (
                    <DuplicateModal productId={selectedProducts[0]} />
                  )}
                </Group>
              )}
              <Table striped={false} highlightOnHover>
                <thead style={{ width: "100%" }}>
                  <tr>
                    <th>
                      <Group position="apart">
                        <Checkbox
                          checked={
                            selectedProducts.length ===
                            data?.pages?.flatMap((page) => page)?.length
                          }
                          onChange={() => {
                            if (
                              selectedProducts.length ===
                              data.pages.flatMap((page) => page).length
                            ) {
                              setSelectedProducts([]);
                              return;
                            }
                            setSelectedProducts([
                              ...data?.pages?.flatMap((page) =>
                                page.map((product) => product.id)
                              )
                            ]);
                          }}
                        />
                      </Group>
                    </th>
                    <th
                      style={{
                        textAlign: "center"
                      }}>
                      {t("Title")}
                    </th>
                    <th
                      style={{
                        textAlign: "center"
                      }}>
                      {t("Actions")}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ width: "100%" }}>
                  {isLoading || areResultsLoading ? (
                    <Loader />
                  ) : Array.isArray(results) && results.length === 0 ? (
                    <Container
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        height: "150px"
                      }}>
                      <Text mt={16}>{t("you have no products yet")}</Text>
                      <Button component={Link} to={"/product"}>
                        {t("Create Product")}
                      </Button>
                    </Container>
                  ) : (
                    results?.map((product) => (
                      <tr onClick={() => {}}>
                        <td>
                          <Checkbox
                            checked={
                              !!selectedProducts.find((id) => id === product.id)
                            }
                            onChange={() => {
                              const isProductSelected = selectedProducts.find(
                                (id) => id === product.id
                              );
                              if (isProductSelected) {
                                setSelectedProducts(
                                  selectedProducts.filter(
                                    (id) => id !== product.id
                                  )
                                );
                                return;
                              }
                              setSelectedProducts([
                                ...selectedProducts,
                                product.id
                              ]);
                            }}
                          />
                        </td>
                        <td
                          style={{
                            textAlign: "center"
                          }}>
                          <UnstyledButton
                            component={Link}
                            to={`/products/${product.id}`}>
                            {product.title}
                          </UnstyledButton>
                        </td>
                        <td
                          style={{
                            textAlign: "center"
                          }}>
                          <Button
                            variant="outline"
                            onClick={() => {
                              mutate({
                                productId: product.id,
                                title: product.title
                              });
                            }}>
                            {t("Delete")}
                          </Button>
                        </td>
                      </tr>
                    ))
                    // })
                  )}
                </tbody>
              </Table>
            </Container>
          )}
        </Card>
        <Center m={"12px auto"}>
          <Button
            onClick={() =>
              fetchNextPage({
                pageParam: length
              })
            }>
            {t("Load more")}
          </Button>
        </Center>
      </Stack>
    </Container>
  );
};

//  <InfoCard onChangeHandler={onChangeHandler} productInfo={productInfo} />

export default ManageProducts;
