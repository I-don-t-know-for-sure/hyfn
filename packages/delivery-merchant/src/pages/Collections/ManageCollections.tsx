import {
  Box,
  Button,
  Card,
  CardSection,
  Center,
  Checkbox,
  Container,
  Grid,
  Group,
  Loader,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  UnstyledButton
} from "@mantine/core";
import usePersistState from "hooks/usePersistState";
import InfoCard from "components/InfoCard";
import React, { useEffect, useState } from "react";
import { CollectionCard, CollectionInfo } from "./types";
import TypeCard from "./components/TypeCard";
import Collection from "./components/CreateCollection";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import { t } from "utils/i18nextFix";

import { fetchApi } from "utils/fetch";
// import { Helmet } from 'react-helmet-async'

import { useUser } from "contexts/userContext/User";
import { useGetCollections } from "./hooks/useGetCollections";
import { productTabsObject } from "hyfn-types";
import { Helmet } from "react-helmet";
import { useGetCollectionSearchHits } from "./hooks/useGetCollectionSearchHits";

interface ManageCollectionsProps {}

const ManageCollections: React.FC<ManageCollectionsProps> = ({}) => {
  const [filterText, setFilterText] = useState("");

  const [tabs, setTabs] = useState("all");
  const { isLoading, error, data, isFetching } = useGetCollections({
    filter: tabs,
    searchValue: filterText
  });
  const { isLoading: searchHitsLoading, data: searchHitsResults } =
    useGetCollectionSearchHits({
      filter: tabs,
      searchValue: filterText
    });
  const [collections, setCollections] = useState<
    (typeof searchHitsResults)["pages"]["0"] | (typeof data)["pages"]["0"]
  >([]);

  useEffect(() => {
    if (!filterText) {
      const flatCollectionsResults =
        data?.pages && Array.isArray(data?.pages)
          ? data?.pages?.flatMap((page) => page)
          : [];
      setCollections(flatCollectionsResults);
    }
    if (filterText) {
      const flatSearchHits =
        searchHitsResults?.pages && Array.isArray(searchHitsResults?.pages)
          ? searchHitsResults?.pages?.flatMap((page) => page)
          : [];
      setCollections(flatSearchHits);
    }
  }, [isLoading, searchHitsLoading, searchHitsResults, data]);

  return (
    <Container>
      <Helmet>
        <title>{t("Collections")}</title>
      </Helmet>
      <Stack>
        <Group position="apart">
          <Text>{t("Collections")}</Text>

          <Button component={Link} to={"/createcollection"}>
            {t("Create a collection")}
          </Button>
        </Group>

        <Card
          // sx={{ margin: '16px auto' }}
          shadow="sm">
          <Tabs
            // initialTab={0}
            defaultValue={"all"}
            onTabChange={setTabs}>
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
          <Container>
            <Group grow mt={8}>
              <TextInput
                sx={{
                  minWidth: "148px"
                }}
                placeholder={t("Search for collections")}
                value={filterText}
                onChange={(e) => {
                  setFilterText(e.currentTarget.value);
                }}
              />
            </Group>
          </Container>

          <CardSection sx={{ borderBottom: "1px solid gray" }}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "space-between"
              }}>
              <Container
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignSelf: "center",
                  width: "100%",
                  margin: "8px 0px"
                }}>
                <Table striped highlightOnHover>
                  <thead>
                    <tr>
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
                        {" "}
                        {t("conditions")}
                      </th>
                    </tr>
                  </thead>
                  {(isLoading || searchHitsLoading) && !error ? (
                    <Loader />
                  ) : (
                    <tbody>
                      {!(data?.pages?.length > 0) ? (
                        <Box>{t("No collections yet")}</Box>
                      ) : (
                        collections?.map((collection) => (
                          <tr onClick={() => {}}>
                            <td
                              style={{
                                textAlign: "center"
                              }}>
                              <UnstyledButton
                                m={"auto"}
                                component={Link}
                                to={`/collection/${collection.id}`}>
                                {collection.title}
                              </UnstyledButton>
                            </td>
                            {false ? (
                              <td
                                style={{
                                  textAlign: "center"
                                }}>
                                {" "}
                                {t("with conditions")}
                              </td>
                            ) : (
                              <td
                                style={{
                                  textAlign: "center"
                                }}>
                                {" "}
                                {t("no conditions")}
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  )}
                </Table>
              </Container>
            </Container>
          </CardSection>
        </Card>
      </Stack>
    </Container>
  );
};

export default ManageCollections;
