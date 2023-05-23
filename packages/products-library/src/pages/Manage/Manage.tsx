import {
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Group,
  Loader,
  Tab,
  Table,
  Tabs,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import BrandModal from "components/BrandModal";

import { t } from "utils/i18nextFix";
import { useGetBrandsForList } from "pages/Brands/Hooks/useGetBrandsForList";
import { useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
import { InfiniteData } from "react-query";

import { Link } from "react-router-dom";
import { useDeleteProduct } from "./hooks/useDelteProduct";
import { useGetProducts } from "./hooks/useGetProducts";
import { useSearchProducts } from "./hooks/useSearchProducts";

const ManageProducts: React.FC = () => {
  const [lastDocId] = useState();
  const [filterText, setFilterText] = useState("");
  const [checkedFilter, setCheckedFilter] = useState<any>(2);

  const { data, isLoading, isError, fetchNextPage } = useGetProducts({
    lastDocId,
    check: checkedFilter,
    filterText,
  });

  const { data: searchResults, isLoading: areResultsLoading } =
    useSearchProducts(filterText);
  const [results, setResults] = useState<any[]>([]);
  const { mutate } = useDeleteProduct();
  const [scroll] = useWindowScroll();
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
      setResults(searchResults);
    }
  }, [filterText, data, searchResults, isLoading, areResultsLoading]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  return (
    <>
      {/* <Helmet>
        <title>{t("Products")}</title>
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
          <BrandModal />
          <Group position="center">
            <Button component={Link} to={"/product"}>
              {t("Create Product")}
            </Button>
          </Group>
          {/* <DownLoadProductsModal /> */}
          {/* <BulkUpdate /> */}
        </Container>
      </Center>
      <Container>
        <Card sx={{ margin: "16px auto" }} shadow="xl">
          <Tabs initialTab={0} onTabChange={setCheckedFilter}>
            <Tabs.Tab label={t("All")} value={"all"}>
              {t("All")}
            </Tabs.Tab>

            <Tabs.Tab label={t("Active")} value={"active"}>
              {t("Active")}
            </Tabs.Tab>
            <Tabs.Tab label={t("Inactive")} value={"inactive"}>
              {t("Inactive")}
            </Tabs.Tab>
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
            <Text>{t("error")}</Text>
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

                  {selectedProducts.length === 1 && <></>}
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
                              ...data?.pages?.map((page) =>
                                page.map((product) => product.id)
                              ),
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
                      <tr onClick={() => {}}>
                        <td>
                          <Checkbox
                            checked={selectedProducts.find(
                              (selectedProduct) =>
                                selectedProduct.id === product.id
                            )}
                            onChange={() => {
                              const isProductSelected = selectedProducts.find(
                                (selectedProduct) =>
                                  selectedProduct.id === product.id
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
                                product.id,
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
                            to={`/products/${product.id}`}
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
                                productId: product.id,
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
            sx={{
              width: "100%",
              maxWidth: "450px",
            }}
            onClick={() =>
              fetchNextPage({
                pageParam:
                  data?.pages[data?.pages?.length - 1][
                    data?.pages[data.pages?.length - 1]?.length - 1
                  ]?.id,
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
