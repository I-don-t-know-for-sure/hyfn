import {
  Button,
  Card,
  Checkbox,
  Container,
  Stack,
  TextInput
} from "@mantine/core";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";
import { useAddEmployee } from "./hooks/useAddEmployee";

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
              }}>
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
      </Stack>
    </Container>
  );
};

export default Employees;
