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
  Table,
  Tabs,
  Text,
  TextInput,
  UnstyledButton,
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

import fetchUtil from "utils/fetch";
// import { Helmet } from 'react-helmet-async'
import { collections } from "hyfn-types";
import { useUser } from "contexts/userContext/User";

interface ManageCollectionsProps {}

const ManageCollections: React.FC<ManageCollectionsProps> = ({}) => {
  const [filterText, setFilterText] = useState("");
  const { userId, userDocument } = useUser();

  const [checkedFilter, setCheckedFilter] = useState<any>(undefined);
  const [taps, setTaps] = useState("all");

  // useEffect(() => {
  //   fetch(
  //     "https://eu-west-1.aws.data.mongodb-api.com/app/application-0-suydu/endpoint/getcollections",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // 'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: JSON.stringify(info),
  //     }
  //   )
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //
  //     });
  // });

  const {
    isLoading,
    error,
    data = [],
    isFetching,
  } = useQuery(collections, async () => {
    const collections = await fetchUtil({
      url: `${import.meta.env.VITE_APP_BASE_URL}/getAllCollections`,
      reqData: [userDocument.storeDoc],
    });

    return collections;
  });

  useEffect(() => {
    if (taps === "all") {
      setCheckedFilter(undefined);
    }
    if (taps === "active") {
      setCheckedFilter({ active: true });
    }
    if (taps === "inactive") {
      setCheckedFilter({ active: false });
    }
    console.log("🚀 ~ file: ManageCollections.tsx:90 ~ taps", taps);
  }, [taps]);

  return (
    <Container>
      {/* <Helmet>
        <title>{t('Collections')}</title>
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
          <Text>{t("Collections")}</Text>

          <Button component={Link} to={"/createcollection"}>
            {t("Create a collection")}
          </Button>
        </Container>
      </Center>
      <Card
        // sx={{ margin: '16px auto' }}
        shadow="sm"
      >
        <Tabs
          // initialTab={0}
          defaultValue={"all"}
          onTabChange={setTaps}
        >
          <Tabs.List>
            <Tabs.Tab value={"all"}>{t("All")}</Tabs.Tab>

            <Tabs.Tab value={"active"}>{t("Active")}</Tabs.Tab>
            <Tabs.Tab value={"inactive"}>{t("Inactive")}</Tabs.Tab>
          </Tabs.List>
          {/* <Tabs.Panel value={'all'} >

          </Tabs.Panel>
          <Tabs.Panel value={'active'} >

          </Tabs.Panel>
          <Tabs.Panel value={'inactive'} >

          </Tabs.Panel> */}
        </Tabs>
        <Group grow>
          <TextInput
            sx={{
              minWidth: "148px",
            }}
            placeholder={t("Search for collections")}
            value={filterText}
            onChange={(e) => {
              setFilterText(e.currentTarget.value);
            }}
          />
          {/* <Group grow mb={6}>
            <Checkbox
              styles={{
                root: {
                  display: "flex",
                  flexDirection: "column-reverse",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "6px",
                },
                label: {
                  margin: "0px 3px 3px 0px",
                },

                input: {
                  margin: "2px 0px 3px 0px",
                },
              }}
              label={t("active")}
              checked={checkedFilter?.active || false}
              onChange={() => {
                setCheckedFilter({ active: true });
              }}
            />

            <Checkbox
              styles={{
                root: {
                  display: "flex",
                  flexDirection: "column-reverse",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "6px",
                },
                label: {
                  margin: "0px 3px 3px 0px",
                },

                input: {
                  margin: "2px 0px 3px 0px",
                },
              }}
              label={t("inactive")}
              checked={
                checkedFilter?.active !== undefined &&
                checkedFilter?.active === false
              }
              onChange={() => {
                setCheckedFilter({ active: false });
              }}
            />
            <Checkbox
              label={t("all")}
              styles={{
                root: {
                  display: "flex",
                  flexDirection: "column-reverse",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "6px",
                },
                label: {
                  margin: "0px 3px 3px 0px",
                },

                input: {
                  margin: "2px 0px 3px 0px",
                },
              }}
              checked={checkedFilter?.active === undefined}
              onChange={() => {
                setCheckedFilter({});
              }}
            />
          </Group> */}
        </Group>

        <CardSection sx={{ borderBottom: "1px solid gray" }}>
          <Container
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
            }}
          >
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignSelf: "center",
                width: "100%",
                margin: "8px 0px",
              }}
            >
              <Table striped highlightOnHover>
                <thead>
                  <tr>
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
                      {" "}
                      {t("conditions")}
                    </th>
                  </tr>
                </thead>
                {(isLoading || !data) && !error ? (
                  <Loader />
                ) : (
                  <tbody>
                    {!(data?.length > 0) ? (
                      <Box>{t("No collections yet")}</Box>
                    ) : checkedFilter !== undefined || filterText ? (
                      data
                        .filter((collection) => {
                          if (
                            checkedFilter.active !== undefined &&
                            !filterText
                          ) {
                            return checkedFilter.active === collection.isActive;
                          }
                          if (
                            checkedFilter.active === undefined &&
                            filterText
                          ) {
                            return collection.textInfo.title?.includes(
                              filterText.toLowerCase().trim()
                            );
                          }
                          if (
                            checkedFilter.active !== undefined &&
                            filterText
                          ) {
                            return (
                              collection.textInfo.title?.includes(
                                filterText.toLowerCase().trim()
                              ) && checkedFilter.active === collection.isActive
                            );
                          }
                        })

                        .map((collection) => (
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
                              <UnstyledButton
                                m={"auto"}
                                component={Link}
                                to={`/collection/${collection._id}`}
                              >
                                {collection.textInfo.title}
                              </UnstyledButton>
                            </td>
                            {collection.conditions ? (
                              <td
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                {t("with conditions")}
                              </td>
                            ) : (
                              <td
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                {t("no conditions")}
                              </td>
                            )}
                            {/* <Button variant="outline">Delete</Button> */}
                          </tr>
                        ))
                    ) : (
                      data?.map((collection: CollectionInfo) => (
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
                            <UnstyledButton
                              m={"auto"}
                              component={Link}
                              to={`/collection/${collection._id}`}
                            >
                              {collection?.textInfo?.title}
                            </UnstyledButton>
                          </td>
                          {collection.conditions ? (
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {" "}
                              {t("with conditions")}
                            </td>
                          ) : (
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
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
        <CardSection></CardSection>
      </Card>
    </Container>
  );
};

export default ManageCollections;
