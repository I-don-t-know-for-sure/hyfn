import {
  Button,
  Checkbox,
  Container,
  Group,
  MultiSelect,
  Table,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useFixedComponent } from "contexts/fixedComponentContext/FixedComponentProvider";
import { t } from 'utils/i18nextFix';
import { useBulkUpdate } from "pages/Manage/hooks/useBulkUpdate";

import React, { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router";
import TableInput from "./components/TableInput";
import TableRow from "./components/TableRow";

export enum ActionTypes {
  ON_CHANGE_HANDLER = "ON_CHANGE_HANDLER",
}
interface BulkUpdateTableProps {}

const BulkUpdateTable: React.FC<BulkUpdateTableProps> = ({}) => {
  const location = useLocation();
  const { products } = location.state as { products: any[] };

  const [selectvalue, setSelectValue] = useState([
    "textInfo.title",

    "textInfo.description",
  ]);

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case ActionTypes.ON_CHANGE_HANDLER:
        const { _id, changedKey, firstChangedKey, value } = payload;
        return state.map((product) => {
          if (product._id !== _id) {
            return product;
          }
          if (changedKey === undefined) {
            return {
              ...product,
              [`${firstChangedKey}`]: value,
            };
          }

          return {
            ...product,
            [`${firstChangedKey}`]: {
              ...product[`${firstChangedKey}`],
              [`${changedKey}`]: value,
            },
          };
        });
    }
  };

  const [tableData, dispatch] = useReducer(reducer, products);
  const selectData = [
    { label: t("Description"), value: "textInfo.description" },
    { label: t("Title"), value: "textInfo.title" },
    { label: t("Weight in Kilo"), value: "weightInKilo" },

    { label: t("Measurement system"), value: "measurementSystem" },
  ];

  const { mutate } = useBulkUpdate();
  const isXl = useMediaQuery("(min-width: 900px)");
  const isMobile = isXl === false;

  const [, setFixedComponent] = useFixedComponent();

  //   const onChangeHandler = ({
  //     value,
  //     firstChangedKey,
  //     changedKey,
  //     _id,
  //   }: {
  //     value: any;
  //     firstChangedKey: string;
  //     changedKey?: string;
  //     _id: string;
  //   }) => {
  //     setTableData(prevState: any) => {
  //       return prevState.map((product) => {
  //         if (product._id !== _id) {
  //           return product;
  //         }
  //         if (changedKey === undefined) {
  //           return {
  //             ...product,
  //             [`${firstChangedKey}`]: value,
  //           };
  //         }

  //         return {
  //           ...product,
  //           [`${firstChangedKey}`]: {
  //             ...product[`${firstChangedKey}`],
  //             [`${changedKey}`]: value,
  //           },
  //         };
  //       });
  //     });
  //   };

  useEffect(() => {
    const fixedComponentConstructor = [
      () => (
        <Container
          sx={(theme) => ({
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            margin: " 4px auto ",
            borderRadius: "6px",
            height: "46px",
            width: isMobile ? "95%" : "50%",
          })}
        >
          <Button
            sx={{
              width: "100%",
            }}
            onClick={() => {
              mutate({ productsArray: tableData });
            }}
          >
            {t("Update")}
          </Button>
        </Container>
      ),
    ];

    setFixedComponent(fixedComponentConstructor);
  }, [setFixedComponent, tableData]);

  return (
    <>
      <Group>
        <MultiSelect
          m={"16px auto"}
          data={selectData}
          value={selectvalue}
          onChange={(e) => {
            setSelectValue(e);
          }}
        />
      </Group>
      <Table>
        <thead>
          <tr>
            {selectvalue.map((value) => {
              const { label } = selectData.find((item) => item.value === value);
              return <th key={value}>{label}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {tableData.map((product) => {
            return (
              <TableRow
                product={product}
                selectvalue={selectvalue}
                onChangeHandler={dispatch}
              />
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default BulkUpdateTable;
