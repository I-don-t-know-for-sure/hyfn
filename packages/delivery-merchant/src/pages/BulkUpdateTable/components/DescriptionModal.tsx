import {
  Badge,
  Button,
  FileInput,
  Group,
  Modal,
  Stack,
  Text,
} from "hyfn-client";
import FullTextEditor from "components/FullTextEditor";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { ActionTypes } from "../BulkUpdateTable";
import ValueComponent from "components/PreviewImage";

interface DescriptionModalProps {
  value: any;
  onChange: any;
  id: string;
  productInfo: any;
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({
  onChange,
  value,
  id,
  productInfo,
}) => {
  console.log("🚀 ~ file: DescriptionModal.tsx:18 ~ value:", value);
  const [opened, setOpened] = useState(false);
  const { generateDescriptionImages } = productInfo;
  const [fullTextEditorValue, setFullTextEditorValue] = useState("");
  const [file, setFile] = useState<File[] | null>(generateDescriptionImages);
  useEffect(() => {
    if (fullTextEditorValue !== "") {
      onChange({
        type: ActionTypes.ON_CHANGE_HANDLER,
        payload: {
          value: fullTextEditorValue,
          firstChangedKey: "textInfo",
          changedKey: "description",
          id,
        },
      });
    }
  }, [fullTextEditorValue]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
      >
        <Stack>
          {generateDescriptionImages &&
            generateDescriptionImages.map((generateDescriptionImage: any) => {
              <Badge
                rightSection={
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => {
                      setFile(null);
                      onChange({
                        type: ActionTypes.ON_CHANGE_HANDLER,
                        payload: {
                          value: null,

                          firstChangedKey: "generateDescriptionImages",

                          id,
                        },
                      });
                    }}
                  >
                    X
                  </Button>
                }
                key={generateDescriptionImage?.name}
                size={"md"}
              >
                <Text>{generateDescriptionImage?.name}</Text>
              </Badge>;
            })}

          <FileInput
            valueComponent={ValueComponent}
            label={t("Generate description")}
            multiple
            onChange={(file) => {
              setFile(file);
              onChange({
                type: ActionTypes.ON_CHANGE_HANDLER,
                payload: {
                  value: file,
                  firstChangedKey: "generateDescriptionImages",

                  id,
                },
              });
            }}
            value={file}
          />
          <Stack>
            <Text>{t("Description")}</Text>
            <FullTextEditor setValue={setFullTextEditorValue} value={value} />
          </Stack>
        </Stack>
      </Modal>

      <Button
        onClick={() => {
          setOpened(true);
        }}
        compact
        variant="subtle"
      >
        {t("Show Description")}
      </Button>
    </>
  );
};

export default DescriptionModal;
