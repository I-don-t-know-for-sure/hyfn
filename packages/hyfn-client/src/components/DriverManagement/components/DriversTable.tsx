import { Button, Center, Table, Text } from "@mantine/core";
import { t } from "i18next";
import React from "react";

import DriverModal from "./DriverModal";

interface DriversListProps {
  drivers: any[];
  removeDriver: any;
  updateDriverBalance: any;
}

const DriversTable: React.FC<DriversListProps> = ({
  drivers,
  removeDriver,
  updateDriverBalance,
}) => {
  return (
    <>
      {drivers?.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>{t("Driver name") as any}</th>
              <th>{t("Actions") as any}</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => {
              return (
                <tr key={index}>
                  <td>{`${driver.driverName}`}</td>
                  <td>
                    <DriverModal
                      driver={driver}
                      removeDriver={removeDriver}
                      updateDriverBalance={updateDriverBalance}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <Center
          sx={{
            height: "100%",
          }}
        >
          <Text>{t("You don`t have drivers yet") as any}</Text>
        </Center>
      )}
    </>
  );
};

export default DriversTable;
