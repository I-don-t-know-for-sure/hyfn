import {
  Button,
  Card,
  Checkbox,
  Container,
  Stack,
  TextInput,
} from "hyfn-client";
import { t } from "i18next";
import React, { useState } from "react";
import { useAddEmployee } from "./hooks/useAddEmployee";
import { DriversManagement as Managment } from "hyfn-client";

import { useAddDriverToManagementDrivers } from "../Employees/managementHooks/useAddDriverToStoreDrivers";
import { useGetStoreDrivers } from "../Employees/managementHooks/useGetStoreDrivers";
import { useRemoveDriverFromManagementDrivers } from "../Employees/managementHooks/useRemoveDriverFromStoreDrivers";
import { useSearchDriverByID } from "../Employees/managementHooks/useSearchDriverByID";
import { useUpdateDriverBalance } from "../Employees/managementHooks/useUpdateDriverBalance";
import { customerAppText } from "hyfn-types";

interface EmployeesProps {}

const Employees: React.FC<EmployeesProps> = ({}) => {
  const { mutate: addEmployee } = useAddEmployee();
  const [employeeId, setEmployeeId] = useState<string>("");
  const [onlyStoreDriversCanTakeOrders, setOnlyStoreDriversCanTakeOrders] =
    useState(false);
  return (
    <Container>
      <Stack>
        <Card>
          <Stack>
            <TextInput
              label={t("Add employee")}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <Button
              onClick={() => {
                addEmployee({ employeeId });
              }}
            >
              {t("Add employee")}
            </Button>
          </Stack>
        </Card>
        <Card>
          <Checkbox
            label={t(
              customerAppText[
                "Only store drivers are allowed to take store orders"
              ]
            )}
            checked={onlyStoreDriversCanTakeOrders}
            onChange={(e) => setOnlyStoreDriversCanTakeOrders(e.target.checked)}
          />
        </Card>
        <Managment
          useAddDriverToManagementDrivers={useAddDriverToManagementDrivers}
          useGetStoreDrivers={useGetStoreDrivers}
          useRemoveDriverFromManagementDrivers={
            useRemoveDriverFromManagementDrivers
          }
          useSearchDriverByID={useSearchDriverByID}
          useUpdateDriverBalance={useUpdateDriverBalance}
        />
      </Stack>
    </Container>
  );
};

export default Employees;
