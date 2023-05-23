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
import { t } from "utils/i18nextFix";
import { useBulkUpdate } from "pages/Manage/hooks/useBulkUpdate";

import React, { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router";
import TableInput from "./components/TableInput";
import TableRow from "./components/TableRow";
import { convertObjectToArray } from "./utils/convertObjectToArray";

import { log } from "console";

export enum ActionTypes {
  ON_CHANGE_HANDLER = "ON_CHANGE_HANDLER",
}

interface BulkUpdateTableProps {}

const BulkUpdateTable: React.FC<BulkUpdateTableProps> = ({}) => {
  const location = useLocation();
  const { products } = location.state as { products: any[] };
  console.log("🚀 ~ file: BulkUpdateTable.tsx:21 ~ products:", location.state);

  const productsObjects = products.reduce((accu, product) => {
    return { ...accu, [product?.id?.toString()]: product };
  }, {});

  const [selectvalue, setSelectValue] = useState([
    "title",
    "price",
    "description",
    "isActive",
  ]);

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case ActionTypes.ON_CHANGE_HANDLER:
        const { id, changedKey, firstChangedKey, value } = payload;
        console.log(
          "🚀 ~ file: BulkUpdateTable.tsx:47 ~ reducer ~ firstChangedKey:",
          firstChangedKey
        );
        console.log(
          "🚀 ~ file: BulkUpdateTable.tsx:47 ~ reducer ~ value:",
          value
        );
        console.log(
          "🚀 ~ file: BulkUpdateTable.tsx:35 ~ productsObjects ~ productsObjects:",
          productsObjects
        );

        if (changedKey === undefined) {
          state[id][`${firstChangedKey}`] = value;
          console.log(state);

          return state;
        }
        const newState = {
          ...state,
          [id]: {
            ...state[id],
            [`${firstChangedKey}`]: {
              ...state[id][`${firstChangedKey}`],
              [`${changedKey}`]: value,
            },
          },
        };
        return newState;

      // return state.map((product) => {
      //   if (product.id !==id) {
      //     return product;
      //   }
      //   if (changedKey === undefined) {
      //     return {
      //       ...product,
      //       [`${firstChangedKey}`]: value,
      //     };
      //   }

      //   return {
      //     ...product,
      //     [`${firstChangedKey}`]: {
      //       ...product[`${firstChangedKey}`],
      //       [`${changedKey}`]: value,
      //     },
      //   };
      // });
    }
  };

  const [tableData, dispatch] = useReducer(reducer, productsObjects);
  const selectData = [
    { label: t("Price"), value: "price" },
    // { label: t("Cost Per Item"), value: "pricing.costPerItem" },
    { label: t("Prev price"), value: "prevPrice" },
    { label: t("Description"), value: "description" },
    { label: t("Title"), value: "title" },
    // { label: t("Weight in Kilo"), value: "weightInKilo" },
    { label: t("Is Active"), value: "isActive" },
    { label: t("Measurement system"), value: "measurementSystem" },
    { label: t("Product pics"), value: "images" },
  ];

  const selectDataObject = {
    price: { label: t("Price"), value: "price" },
    // "pricing.costPerItem": {
    //   label: t("Cost Per Item"),
    //   value: "pricing.costPerItem",
    // },
    prevPrice: { label: t("Prev price"), value: "prevPrice" },
    description: {
      label: t("Description"),
      value: "textInfo.description",
    },
    title: { label: t("Title"), value: "title" },
    // weightInKilo: { label: t("Weight in Kilo"), value: "weightInKilo" },
    isActive: { label: t("Is Active"), value: "isActive" },
    measurementSystem: {
      label: t("Measurement system"),
      value: "measurementSystem",
    },
    images: { label: t("Product pics"), value: "images" },
  };
  const { mutate } = useBulkUpdate();
  const isXl = useMediaQuery("(min-width: 900px)");
  const isMobile = !isXl;

  const [, setFixedComponent] = useFixedComponent();

  //   const onChangeHandler = ({
  //     value,
  //     firstChangedKey,
  //     changedKey,
  //    id,
  //   }: {
  //     value: any;
  //     firstChangedKey: string;
  //     changedKey?: string;
  //    id: string;
  //   }) => {
  //     setTableData(prevState: any) => {
  //       return prevState.map((product) => {
  //         if (product.id !==id) {
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
              console.log(
                "🚀 ~ file: BulkUpdateTable.tsx:181 ~ useEffect ~ tableData:",
                tableData
              );
              const res = convertObjectToArray(tableData);
              console.log(
                "🚀 ~ file: BulkUpdateTable.tsx:180 ~ useEffect ~ res:",
                res
              );

              mutate({ productsArray: res });
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
              const { label } = selectDataObject[value];
              return <th key={value}>{label}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {Object.keys(tableData).map((productId) => {
            const product = tableData[productId];
            return (
              <TableRow
                key={productId}
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
