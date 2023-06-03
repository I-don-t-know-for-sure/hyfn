import { Button, Input } from "hyfn-client";
import React, { useEffect, useState } from "react";

interface BulkUpdateProps {}

const BulkUpdate: React.FC<BulkUpdateProps> = () => {
  const [fileData, setFileData] = useState<any>([]);
  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const newValue = JSON.parse(e.target.result.toString());
      setFileData(newValue);
    };
  };
  useEffect(() => {}, [fileData]);
  return (
    <>
      <Input type={"file"} onChange={handleChange} />

      <Button></Button>
    </>
  );
};

export default BulkUpdate;
