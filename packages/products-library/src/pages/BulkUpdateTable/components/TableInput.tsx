import { TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useEffect, useState } from "react";

interface TableInputProps {
  value: any;
  changeHandler: any;
}

const TableInput: React.FC<TableInputProps> = React.memo(
  ({ value, changeHandler }) => {
    const [textValue, setTextValue] = useState(value);
    const debouncedValue = useDebouncedValue(textValue, 500);
    useEffect(() => {
      changeHandler(debouncedValue);
    }, [debouncedValue]);
    return (
      <TextInput
        value={textValue}
        onChange={(e) => setTextValue(e.currentTarget.value)}
      />
    );
  }
);
export default TableInput;
