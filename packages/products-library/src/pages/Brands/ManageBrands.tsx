import {
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Group,
  Loader,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import BrandModal from "components/BrandModal";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";
// import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useDeleteBrand } from "./Hooks/useDeleteBrand";
import { useGetBrands } from "./Hooks/useGetBrands";

interface ManageBrandsProps {}

const ManageBrands: React.FC<ManageBrandsProps> = ({}) => {
  const { data, fetchNextPage } = useGetBrands();
  const [filterText, setFilterText] = useState("");
  const { mutate } = useDeleteBrand();
  console.log(data);

  return (
    <Container>
      {/* <Helmet>
        <title>{t("Brands")}</title>
      </Helmet> */}
      <Container
        sx={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text>{t("Brands")}</Text>
        <BrandModal />

        {/* <DownLoadProductsModal /> */}
        {/* <BulkUpdate /> */}
      </Container>

      <Card sx={{ margin: "16px auto" }} shadow="xl">
        <Group grow>
          <TextInput
            sx={{
              minWidth: "148px",
            }}
            placeholder={t("Search in your brands")}
            value={filterText}
            onChange={(e) => {
              setFilterText(e.currentTarget.value);
            }}
          />
        </Group>
        <Table>
          <thead style={{ width: "100%" }}>
            <tr>
              {/* <th>
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
                    </th> */}
              <th
                style={{
                  textAlign: "center",
                }}
              >
                {t("Brand name")}
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
          <tbody>
            {!(data?.pages?.length > 0) ? (
              <Box>{t("No Barnds yet")}</Box>
            ) : filterText ? (
              data.pages
                .flatMap((brand) => brand)
                .filter((brand) => {
                  return brand.label?.includes(filterText.toLowerCase().trim());
                })

                .map((brand) => (
                  <tr
                    onClick={() => {
                      //navigate(`/${product._id.toString()}`, { replace: true })
                    }}
                    // style={{
                    //   width: "100%",
                    //   display: "flex",
                    //   flexDirection: "row",
                    //   justifyContent: "space-around",
                    //   padding: "8px 0px",
                    // }}
                  >
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <BrandModal
                        brandLabel={brand?.label}
                        brandDescription={brand?.description}
                        brandId={brand?.value}
                      />
                    </td>
                    <td>
                      <Group position="center" direction="row">
                        <Button
                          color={"red"}
                          variant={"outline"}
                          compact
                          onClick={() => mutate({ brandId: brand?.value })}
                        >
                          {t("Delete")}
                        </Button>
                      </Group>
                    </td>

                    {/* <Button variant="outline">Delete</Button> */}
                  </tr>
                ))
            ) : (
              data.pages
                .flatMap((brand) => brand)
                .map((brand) => (
                  <tr
                  // style={{
                  //   width: "100%",
                  //   display: "flex",
                  //   flexDirection: "row",
                  //   justifyContent: "space-around",
                  //   padding: "8px 0px",
                  // }}
                  >
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <BrandModal
                        brandLabel={brand?.label}
                        brandDescription={brand?.description}
                        brandId={brand?.value}
                      />
                    </td>
                    <td>
                      <Group position="center" direction="row">
                        <Button
                          color={"red"}
                          variant={"outline"}
                          compact
                          onClick={() => mutate({ brandId: brand?.value })}
                        >
                          {t("Delete")}
                        </Button>
                      </Group>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </Table>
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
                ]?._id,
            })
          }
        >
          {t("Load more")}
        </Button>
      </Center>
    </Container>
  );
};

export default ManageBrands;
