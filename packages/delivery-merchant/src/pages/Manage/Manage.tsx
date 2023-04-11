import {
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Group,
  Loader,
  Table,
  Tabs,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

import { t } from "utils/i18nextFix";
import { useEffect, useState } from "react";

import { InfiniteData } from "react-query";

import { Link } from "react-router-dom";
import BulkImportModal from "./components/BulkImportModal";

import DuplicateModal from "./components/DuplicateModal";
import { useDeleteProduct } from "./hooks/useDeleteProduct";
import { useGetProductsForBulkUpdate } from "./hooks/useGetProductsForBulkUpdate";
import { useSearchProducts } from "./hooks/useSearchProducts";
import Test from "./components/Text";
import TestTwo from "./components/TestTwo";
import { useRemoveProductsBackgrounds } from "./hooks/useRemoveBackground";
// import { Helmet } from 'react-helmet'

const ManageProducts: React.FC = () => {
  const [lastDocId] = useState();
  const [filterText, setFilterText] = useState("");
  const [checkedFilter, setCheckedFilter] = useState<any>("all");
  const { mutate: removeBackgounds } = useRemoveProductsBackgrounds();
  // const { data, isLoading, isError, fetchNextPage } = useGetProducts({
  //   lastDocId,
  //   check: checkedFilter,
  //   filterText,
  // });
  const { data, isLoading, isError, fetchNextPage, error } =
    useGetProductsForBulkUpdate({
      lastDocId,
      check: checkedFilter,
      filterText,
    });
  console.log("🚀 ~ file: Manage.tsx:47 ~ data", data);

  const { data: searchResults, isLoading: areResultsLoading } =
    useSearchProducts(filterText);
  const [results, setResults] = useState<any[]>([]);
  const { mutate } = useDeleteProduct();
  const [scroll] = useWindowScroll();

  useEffect(() => {
    setSelectedProducts([]);

    console.log("🚀 ~ file: Manage.tsx:57 ~ checkedFilter", checkedFilter);
  }, [checkedFilter]);

  useEffect(() => {
    if (!filterText && data?.pages[data?.pages?.length - 1]) {
      const flatData = data?.pages.reduce((acc, page) => {
        return [...acc, ...page];
      }, []);
      console.log("🚀 ~ file: Manage.tsx:65 ~ flatData ~ flatData", flatData);
      setResults(flatData);
    }
    if (filterText && searchResults?.pages[searchResults?.pages?.length - 1]) {
      setResults(searchResults);
    }
  }, [filterText, data, searchResults, isLoading, areResultsLoading]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  console.log(isLoading, areResultsLoading, isError);

  return (
    <>
      {/* <Helmet>
        <title>{t('Products')}</title>
      </Helmet> */}
      <Center>
        <Container
          sx={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text>{t("Products")}</Text>
          <Group position="center">
            <BulkImportModal />

            <Button component={Link} to={"/product"}>
              {t("Create Product")}
            </Button>
          </Group>
          {/* <DownLoadProductsModal /> */}
          {/* <BulkUpdate /> */}
        </Container>
      </Center>
      <Container>
        <Card
          // sx={{ margin: '16px auto' }}
          shadow="xl"
        >
          <Tabs defaultValue={"all"} onTabChange={setCheckedFilter}>
            <Tabs.List>
              <Tabs.Tab
                onChange={(e) => {
                  console.log("🚀 ~ file: Manage.tsx:107 ~ e", e);
                  console.log(e.currentTarget.value);
                }}
                value={"all"}
              >
                {t("All")}
              </Tabs.Tab>

              <Tabs.Tab value={"active"}>{t("Active")}</Tabs.Tab>
              <Tabs.Tab value={"inactive"}>{t("Inactive")}</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value={"active"}>
              <TestTwo />
            </Tabs.Panel>
            <Tabs.Panel value={"all"}>
              <Test />
            </Tabs.Panel>
          </Tabs>
          <Group>
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
                    component={Link}
                    to="/bulkupdate"
                    state={{ products: selectedProducts }}
                  >
                    {t("Bulk Update")}
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    component={Link}
                    to="/optionstable"
                    state={{ products: selectedProducts }}
                  >
                    {t("Options")}
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      const productIds = selectedProducts.map(
                        (product) => product._id
                      );
                      console.log(
                        "🚀 ~ file: Manage.tsx:173 ~ productIds:",
                        productIds
                      );
                      removeBackgounds({ productIds });
                    }}
                  >
                    {t("Remove image backgrounds")}
                  </Button>
                  {selectedProducts.length === 1 && (
                    <DuplicateModal productId={selectedProducts[0]?._id} />
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
                            data?.pages?.flatMap((page) => page).length
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
                              ...data?.pages?.flatMap((page) => page),
                            ]);
                          }}
                        />
                      </Group>
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {t("Title")}
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                      }}
                    >
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
                        height: "150px",
                      }}
                    >
                      <Text mt={16}>{t("you have no products yet")}</Text>
                      <Button component={Link} to={"/product"}>
                        {t("Create Product")}
                      </Button>
                    </Container>
                  ) : (
                    // data?.pages?.map((page) => {
                    results?.map((product) => (
                      <tr
                        onClick={() => {
                          //navigate(`/${product._id.toString()}`, { replace: true })
                          //
                        }}
                        // style={{
                        //   width: "100%",
                        //   display: "flex",
                        //   flexDirection: "row",
                        //   justifyContent: "space-around",
                        //   padding: "8px 0px",
                        // }}
                      >
                        <td>
                          <Checkbox
                            checked={selectedProducts.find(
                              (selectedProduct) =>
                                selectedProduct._id === product._id
                            )}
                            onChange={() => {
                              const isProductSelected = selectedProducts.find(
                                (selectedProduct) =>
                                  selectedProduct._id === product._id
                              );
                              if (isProductSelected) {
                                setSelectedProducts(
                                  selectedProducts.filter(
                                    (selectedProduct) =>
                                      selectedProduct._id !== product._id
                                  )
                                );
                                return;
                              }
                              setSelectedProducts([
                                ...selectedProducts,
                                product,
                              ]);
                            }}
                          />
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <UnstyledButton
                            component={Link}
                            to={`/products/${product._id.toString()}`}
                          >
                            {product.textInfo.title}
                          </UnstyledButton>
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <Button
                            variant="outline"
                            onClick={() => {
                              mutate({
                                productId: product._id.toString(),
                                title: product.textInfo.title,
                              });
                            }}
                          >
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
            // sx={{
            //   width: '100%',
            //   maxWidth: '450px',
            // }}
            onClick={() =>
              fetchNextPage({
                pageParam:
                  data?.pages[data?.pages?.length - 1][
                    data?.pages[data.pages?.length - 1]?.length - 1
                  ]?._id,
              })
            }
          >
            {t("Load more")}
          </Button>
        </Center>
      </Container>
    </>
  );
};

//  <InfoCard onChangeHandler={onChangeHandler} productInfo={productInfo} />

export default ManageProducts;
