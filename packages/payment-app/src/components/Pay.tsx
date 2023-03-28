import React, { useEffect, useRef, useState } from "react";

import { useLocation } from "react-router";
import { useValidateTransaction } from "../hooks/useValidateTransaction";
import { LoadingOverlay, useMantineColorScheme } from "@mantine/core";

interface PayProps {
  // validation: (any: any) => void;
}

const Pay: React.FC<PayProps> = ({}) => {
  const location = useLocation();
  // const [loading, setLoading] = useState(false)
  const { url, colorScheme, ...configurationObject } = JSON.parse(
    '{"' +
      location.search.slice(1).replace(/&/g, '","').replace(/=/g, '":"') +
      '"}',
    function (key, value) {
      return key === "" ? value : decodeURIComponent(value);
    }
  );
  const { toggleColorScheme } = useMantineColorScheme();
  useEffect(() => {
    toggleColorScheme(colorScheme);
  }, []);
  // console.log(location.search);

  const { mutate } = useValidateTransaction({
    url,
    transactionId: configurationObject.MerchantReference,
  });
  const ref = useRef(true);
  const loading = useRef(true);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL;
    script.async = true;
    document.body.appendChild(script);
    console.log(ref.current);

    if (ref.current) {
      setTimeout(() => {
        console.log(
          "🚀 ~ file: PayWithLocalCard.tsx ~ line 20 ~ useEffect ~ configurationObject",
          configurationObject
        );

        window.Lightbox.Checkout.configure = {
          ...configurationObject,

          completeCallback: function (data: any) {
            mutate();
            console.log(
              "🚀 ~ file: usePayWithLocalCard.ts ~ line 63 ~ useEffect ~ data success",
              data
            );
          },
          errorCallback: function (error: any) {
            console.log(error);
          },
          cancelCallback: function () {
            window.close();
          },
        };
        console.log("hdhdh");

        ref.current = false;
        window.Lightbox.Checkout.showLightbox();
      }, 2000);
    }
  }, []);

  return (
    <>
      <LoadingOverlay visible={loading.current} />
    </>
  );
};

export default Pay;
