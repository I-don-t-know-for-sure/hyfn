import { Checkbox, TextInput } from "@mantine/core";
import React from "react";
import { ActionTypes } from "../BulkUpdateTable";
import TableInput from "./TableInput";

interface TableRowProps {
  product: any;
  selectvalue: any;
  onChangeHandler: any;
}

const TableRow: React.FC<TableRowProps> = ({
  product,
  selectvalue,
  onChangeHandler,
}) => {
  const { _id } = product;

  return (
    <tr key={_id}>
      {selectvalue.map((value, index) => {
        const keys = value?.split(".");

        const keyValue =
          keys?.length > 1 ? product[keys[0]][keys[1]] : product[keys[0]];

        return (
          <td key={index}>
            {/* {value === "isActive" ? (
              <Checkbox
                checked={keyValue}
                onChange={(e) => {
                  console.log("hghgf");

                  onChangeHandler({
                    type: ActionTypes.ON_CHANGE_HANDLER,
                    payload: {
                      value: !keyValue,
                      firstChangedKey: keys[0],
                      changedKey: keys[1],
                      _id,
                    },
                  });
                }}
              />
            ) : (
              // <TableInput
              //   value={keyValue}
              //   changeHandler={(e) =>
              //     onChangeHandler({
              //       value: e,
              //       firstChangedKey: keys[0],
              //       changedKey: keys[1],
              //       _id,
              //     })
              //   }
              // />
              <TextInput
                value={keyValue}
                onChange={(e) =>
                  onChangeHandler({
                    type: ActionTypes.ON_CHANGE_HANDLER,
                    payload: {
                      value: e.currentTarget.value,
                      firstChangedKey: keys[0],
                      changedKey: keys[1],
                      _id,
                    },
                  })
                }
              />
            )} */}
            {value === ""}
            <TableInput
              productInfo={product}
              _id={_id}
              keyValue={keyValue}
              keys={keys}
              onChangeHandler={onChangeHandler}
              value={value}
            />
          </td>
        );
      })}
    </tr>
  );
};

export default TableRow;
