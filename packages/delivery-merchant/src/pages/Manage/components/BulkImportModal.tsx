import {
  ActionIcon,
  Box,
  Button,
  Group,
  Input,
  Modal,
  Text,
  Title,
} from "hyfn-client";

import { t } from "utils/i18nextFix";
import React, { CSSProperties, useEffect, useState } from "react";
import { useCSVReader } from "react-papaparse";

import { BiImport } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import InfoPopover from "components/InfoPopover";
import CSVDownloader from "components/CSVParser";
import { useBulkWrite } from "../hooks/useBulkWrite";
interface BulkImportModalProps {}

const BulkImportModal: React.FC<BulkImportModalProps> = () => {
  const [opened, setOpened] = useState(false);
  const { CSVReader } = useCSVReader();
  const { mutate: bulkWrite } = useBulkWrite();
  const [fileData, setFileData] = useState<any>([]);

  const styles = {
    csvReader: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 10,
    } as CSSProperties,
    browseFile: {
      width: "20%",
    } as CSSProperties,
    acceptedFile: {
      border: "1px solid #ccc",
      height: 45,
      lineHeight: 2.5,
      paddingLeft: 10,
      width: "80%",
    } as CSSProperties,
    remove: {
      borderRadius: 0,
      padding: "0 20px",
    } as CSSProperties,
    progressBarBackgroundColor: {
      backgroundColor: "red",
    } as CSSProperties,
  };
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} size="lg">
        <Group position="apart">
          <Title mb={12}>{t("Bulk upload")}</Title>
          <InfoPopover
            infoText={
              "click download to get a smaple of how the csv file structure should be. note : that your csv file should have an added element in the end"
            }
          />
        </Group>

        {/* <Input type={"file"} onChange={handleChange} /> */}

        <CSVReader
          onUploadAccepted={(input: any) => {
            try {
              input.data.pop();

              const results = input.data;
              const objKeys = results[0];
              const outputArray = [];
              for (let i = 1; i < results?.length; i++) {
                const row = results[i];
                let outputObject;

                for (let x = 0; x < row.length; x++) {
                  outputObject = { ...outputObject, [`${objKeys[x]}`]: row[x] };
                }
                outputArray.push(outputObject);
              }
              if (outputArray?.length === 0) {
                throw new Error("file empty");
              }

              setFileData(input);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
          }: any) => (
            <>
              {/* <div style={styles.csvReader}>
                <button
                  type="button"
                  {...getRootProps()}
                  style={styles.browseFile}
                >
                  Browse file
                </button>
                <div style={styles.acceptedFile}>
                  {acceptedFile && acceptedFile.name}
                </div>
                <button {...getRemoveFileProps()} style={styles.remove}>
                  Remove
                </button>
              </div> */}
              <Box
                {...getRootProps()}
                sx={(theme) => ({
                  margin: "4px auto",
                  height: "60px",
                  border: `1px ${theme.colors["gray"][5]} solid`,
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                <Text>
                  {acceptedFile
                    ? acceptedFile.name
                    : t("click here to pick a file")}
                </Text>
              </Box>

              <ProgressBar style={styles.progressBarBackgroundColor} />
            </>
          )}
        </CSVReader>

        <Group position="apart" grow mt={22}>
          <Button
            onClick={() => {
              bulkWrite(fileData);
            }}
            // sx={{
            //   width: "70%",
            // }}
          >
            {t("Upload")}
          </Button>
          <CSVDownloader />
        </Group>
      </Modal>
      <ActionIcon variant="outline" onClick={() => setOpened(true)}>
        <BiImport />
      </ActionIcon>
    </>
  );
};

export default BulkImportModal;
