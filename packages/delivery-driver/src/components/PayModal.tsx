import { Box, Button, Group, Image, Modal, Table } from "@mantine/core";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";

interface PayModalProps {
  pay: () => void;
  storeProducts: any[];
}

const PayModal: React.FC<PayModalProps> = ({ pay, storeProducts }) => {
  console.log(storeProducts);

  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Box>
          <Table>
            <thead>
              <tr>
                <th>{t("Name")}</th>
                <th>{t("QTY found")}</th>
                <th>{t("Image")}</th>
              </tr>
            </thead>
            <tbody>
              {storeProducts.map((product) => {
                return (
                  <tr>
                    <td>{product?.textInfo?.title}</td>
                    <td>{product?.pickup?.QTYFound || 0}</td>
                    <td>
                      <Image
                        radius={4}
                        sx={{
                          maxWidth: "45px",
                          maxHeight: "45px",
                        }}
                        src={`${import.meta.env.VITE_APP_BUCKET_URL}/tablet/${
                          product.images[0]
                        }`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Box>
        <Button
          fullWidth
          sx={{
            zIndex: 999,
          }}
          onClick={pay}
        >
          {t("Pay")}
        </Button>
      </Modal>

      <Group position="center">
        <Button
          sx={{
            zIndex: 999,
          }}
          onClick={() => {
            setOpened(true);
          }}
        >
          {t("Pay")}
        </Button>
      </Group>
    </>
  );
};

export default PayModal;
