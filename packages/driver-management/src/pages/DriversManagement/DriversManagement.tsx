import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useUser } from "contexts/userContext/User";
import { t } from "../../utils/i18nextFix";
import React, { useEffect, useState } from "react";
import AddToWalletModal from "./components/AddToWalletModal";
import DriverCard from "./components/DriverCard";
import DriversTable from "./components/DriversTable";
import WalletModal from "./components/WalletModal";
import { DriversManagement as Managment } from "hyfn-client";
import { useAddDriverToManagementDrivers } from "./hooks/useAddDriverToStoreDrivers";
import { useGetStoreDrivers } from "./hooks/useGetStoreDrivers";
import { useRemoveDriverFromManagementDrivers } from "./hooks/useRemoveDriverFromStoreDrivers";
import { useSearchDriverByID } from "./hooks/useSearchDriverByID";
import { useUpdateDriverBalance } from "./hooks/useUpdateDriverBalance";
import { AiFillCloseCircle } from "react-icons/ai";
import { z } from "zod";

interface DriversManagementProps {}

const DriversManagement: React.FC<DriversManagementProps> = ({}) => {
  /*   const [searchValue, setSearchValue] = useState("");
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
  const { userDocument } = useUser();
  useEffect(() => {
    setDriversArray(drivers?.pages?.flatMap((page) => page));
  }, [drivers]);
  const mySchema = z
    .object({
      myString: z.string().min(5),
      myUnion: z.union([z.number(), z.boolean()]),
    })
    .describe("My neat object schema");
 */

  return (
    <Managment
      useAddDriverToManagementDrivers={useAddDriverToManagementDrivers}
      useGetStoreDrivers={useGetStoreDrivers}
      useRemoveDriverFromManagementDrivers={
        useRemoveDriverFromManagementDrivers
      }
      useSearchDriverByID={useSearchDriverByID}
      useUpdateDriverBalance={useUpdateDriverBalance}
    />
    /*  <Container>
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
            {t("Search")}
          </Button>
        </Center>
        {isSearching ? (
          isSearchResultLoading ? (
            <Loader />
          ) : typeof searchResult === "string" ? (
            t(searchResult)
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
          {t("Load more")}
        </Button>
      </Center>
    </Container> */
  );
};

export default DriversManagement;
