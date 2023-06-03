/* import { Button, FileInput, Modal, Stack } from "hyfn-client";
import { t } from "utils/i18nextFix";
import React, { useEffect, useState } from "react";
import { useGenerateProductDescription } from "../hooks/useGenerateProductDescription";

interface GenerateDescriptionModalProps {
  onDescriptionChangeHandler: any;
  productId: string;
}

const GenerateDescriptionModal: React.FC<GenerateDescriptionModalProps> = ({
  onDescriptionChangeHandler,
  productId,
}) => {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<File | null>(null);
  const [base64String, setBase64String] = useState("");
  const { mutate: generateProductDescription, data } =
    useGenerateProductDescription();
  useEffect(() => {
    if (data) {
      onDescriptionChangeHandler(data);
      setOpened(false);
    }
  }, [data]);
  function handleFileInputChange(file: File) {
    setValue(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBase64String(reader.result.toString());
    };
  }

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack>
          <FileInput
            label={t("Pick a photo")}
            description={t("The text in the photo must be clear")}
            value={value}
            onChange={handleFileInputChange}
          />
          <Button
            onClick={() => {
              if (!value) {
                return;
              }
              generateProductDescription({ image: base64String, productId });
            }}
          >
            {t("Generate")}
          </Button>
        </Stack>
      </Modal>
      <Button
        onClick={() => {
          setOpened(true);
        }}
        compact
        variant="subtle"
      >
        {t("Generate description")}
      </Button>
    </>
  );
};

export default GenerateDescriptionModal;
 */

import { Button, FileInput, Modal, Stack } from "hyfn-client";
import { t } from "utils/i18nextFix";
import React, { useEffect, useState } from "react";
import { useGenerateProductDescription } from "../hooks/useGenerateProductDescription";

interface GenerateDescriptionModalProps {
  onDescriptionChangeHandler: any;
  productId: string;
}

const GenerateDescriptionModal: React.FC<GenerateDescriptionModalProps> = ({
  onDescriptionChangeHandler,
  productId,
}) => {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<File[] | null>(null);
  const [base64String, setBase64String] = useState("");
  const { mutate: generateProductDescription, data } =
    useGenerateProductDescription();
  useEffect(() => {
    if (data) {
      onDescriptionChangeHandler(data);
      setOpened(false);
    }
  }, [data]);
  // function handleFileInputChange(file: File) {
  //   setValue(file);

  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     setBase64String(reader.result.toString());
  //   };
  // }

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack>
          <FileInput
            multiple
            label={t("Pick a photo")}
            description={t("The text in the photo must be clear")}
            value={value}
            onChange={setValue}
          />
          <Button
            onClick={() => {
              if (!value) {
                return;
              }
              generateProductDescription([{ images: value, productId }]);
            }}
          >
            {t("Generate")}
          </Button>
        </Stack>
      </Modal>
      <Button
        onClick={() => {
          setOpened(true);
        }}
        compact
        variant="subtle"
      >
        {t("Generate description")}
      </Button>
    </>
  );
};

export default GenerateDescriptionModal;
