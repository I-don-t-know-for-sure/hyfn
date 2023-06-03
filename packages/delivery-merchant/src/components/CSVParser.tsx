import { Button } from "hyfn-client";
import { t } from "utils/i18nextFix";
import { useCSVDownloader } from "react-papaparse";
import { usePapaParse } from "react-papaparse";

export default function CSVDownloader() {
  const { CSVDownloader, Type } = useCSVDownloader();

  return (
    <Button
      sx={{
        minWidth: "80px",
      }}
      component={CSVDownloader}
      type={Type.Button}
      filename={"example"}
      bom={true}
      config={{
        delimiter: ",",
      }}
      data={[
        {
          name: "product1",
          price: 5,
        },
        {
          name: "product2",
          price: 2.5,
        },
        {
          name: "",
          price: 0,
        },
      ]}
    >
      Download
    </Button>
  );
}
