import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { t } from "utils/i18nextFix";
import { useCreateBrand } from "pages/Brands/Hooks/useCreateBrand";
import { useGetBrand } from "pages/Brands/Hooks/useGetBrand";
import { useGetBrands } from "pages/Brands/Hooks/useGetBrands";
import { useUpdateBrand } from "pages/Brands/Hooks/useUpdateBrand";
import React, { useEffect, useState } from "react";

interface BrandModalProps {
  brandId?: string;
  brandLabel?: string;
  brandDescription?: string;
}

const BrandModal: React.FC<BrandModalProps> = ({
  brandId,
  brandLabel,
  brandDescription,
}) => {
  const { data: brand } = useGetBrand({ brandId });
  const [opened, setOpened] = useState(false);

  const { mutate } = useCreateBrand();
  const { mutate: updateBrand } = useUpdateBrand();
  const { data: brands } = useGetBrands();
  const form = useForm({
    initialValues: {
      brandName: brandLabel,
      brandDescription: brandDescription,
    },
  });
  useEffect(() => {
    form.setFieldValue("brandName", brandLabel);
    form.setFieldValue("brandDescription", brandDescription);
  }, [brandLabel, brandDescription]);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        > */}
        <form
          onSubmit={form.onSubmit((values) => {
            brandId
              ? updateBrand({
                  brandInfo: {
                    label: values.brandName,
                    description: values.brandDescription,
                  },
                  brandId,
                })
              : mutate({
                  brandInfo: {
                    label: values.brandName,
                    description: values.brandDescription,
                  },
                });
          })}
        >
          <TextInput
            label={t("Brand name")}
            required
            {...form.getInputProps("brandName")}
          />
          <TextInput
            label={t("Brand description")}
            {...form.getInputProps("brandDescription")}
          />
          <Center
            mt={8}
            sx={{
              width: "100%",
            }}
          >
            {brandId ? (
              <Button fullWidth type="submit">
                {t("Update brand")}
              </Button>
            ) : (
              <Button fullWidth type="submit">
                {t("Create brand")}
              </Button>
            )}
          </Center>
        </form>
        {/* </Box> */}
      </Modal>
      {brandId ? (
        <UnstyledButton onClick={() => setOpened(true)}>
          {t(brandLabel || "Manage Brands")}
        </UnstyledButton>
      ) : (
        <Button compact={!!brandLabel} onClick={() => setOpened(true)}>
          {t(brandLabel || "Manage Brands")}
        </Button>
      )}
    </>
  );
};

export default BrandModal;
