import { Button, Loader, Modal } from "@mantine/core";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useDownlaodProducts } from "../hooks/useDownloadProducts";

interface DownLoadProductsModalProps {}

const DownLoadProductsModal: React.FC<DownLoadProductsModalProps> = () => {
  const { mutate, isLoading, isIdle, isSuccess } = useDownlaodProducts();
  const { userId, userDocument } = useUser();

  return isIdle ? (
    <Button onClick={() => mutate()}>{t("make request")} </Button>
  ) : isLoading ? (
    <Loader />
  ) : (
    isSuccess && (
      <a
        href={`${import.meta.env.VITE_APP_PRODUCTS_BUCKET}${userDocument?.id}`}
        download
      >
        {t("DownLoad")}
      </a>
    )
  );
};

export default DownLoadProductsModal;
