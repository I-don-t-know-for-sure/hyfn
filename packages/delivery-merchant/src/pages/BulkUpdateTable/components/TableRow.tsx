import { Checkbox, TextInput } from "hyfn-client";
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
  const { id } = product;

  return (
    <tr key={id}>
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
                     id,
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
              //      id,
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
                     id,
                    },
                  })
                }
              />
            )} */}
            {value === ""}
            <TableInput
              productInfo={product}
              id={id}
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
