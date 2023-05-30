import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Loader,
  TextInput,
} from "@mantine/core";

import { t } from "i18next";
import React, { useEffect, useState } from "react";

import DriverCard from "./components/DriverCard";
import DriversTable from "./components/DriversTable";

import { AiFillCloseCircle } from "react-icons/ai";

interface DriversManagementProps {
  useUpdateDriverBalance: any;
  useSearchDriverByID: any;
  useRemoveDriverFromManagementDrivers: any;
  useGetStoreDrivers: any;
  useAddDriverToManagementDrivers: any;
}

const DriversManagement: React.FC<DriversManagementProps> = ({
  useAddDriverToManagementDrivers,
  useGetStoreDrivers,
  useRemoveDriverFromManagementDrivers,
  useSearchDriverByID,
  useUpdateDriverBalance,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const {
    data: drivers,
    isLoading: areDriversLoading,
    fetchNextPage,
  } = useGetStoreDrivers();
  const { data: searchResult, isLoading: isSearchResultLoading } =
    useSearchDriverByID({
      isEnabled: isSearching,
      searchValue,
    });
  const { mutate: addDriverToStoreDrivers } = useAddDriverToManagementDrivers();
  const { mutate: removeDriverFromStoreDrivers } =
    useRemoveDriverFromManagementDrivers();
  const { mutate: updateDriverBalance } = useUpdateDriverBalance();
  const [driversArray, setDriversArray] = useState([]);

  useEffect(() => {
    setDriversArray(drivers?.pages?.flatMap((page) => page));
  }, [drivers]);

  return (
    <Container>
      <Card
        shadow={"lg"}
        radius={"md"}
        mt={52}
        ml={8}
        mr={8}
        withBorder
        sx={{
          height: "70vh",
        }}
      >
        <Center mb={24} mt={24}>
          <TextInput
            rightSection={
              <ActionIcon
                onClick={() => {
                  setSearchValue("");
                  setIsSearching(false);
                }}
              >
                <AiFillCloseCircle />
              </ActionIcon>
            }
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />

          <Button
            ml={12}
            onClick={() => {
              setIsSearching(true);
            }}
          >
            {t("Search") as any}
          </Button>
        </Center>
        {isSearching ? (
          isSearchResultLoading ? (
            <Loader />
          ) : typeof searchResult === "string" ? (
            (t(searchResult) as any)
          ) : (
            <DriverCard
              addDriver={addDriverToStoreDrivers}
              driverInfo={searchResult}
            />
          )
        ) : areDriversLoading ? (
          <Loader />
        ) : (
          <DriversTable
            updateDriverBalance={updateDriverBalance}
            removeDriver={removeDriverFromStoreDrivers}
            drivers={driversArray}
          />
        )}
      </Card>
      <Center>
        <Button
          mt={24}
          sx={{
            width: "100%",
            maxWidth: "450px",
          }}
          onClick={() =>
            fetchNextPage({ pageParam: driversArray[driversArray.length - 1] })
          }
        >
          {t("Load more") as any}
        </Button>
      </Center>
    </Container>
  );
};

export default DriversManagement;
