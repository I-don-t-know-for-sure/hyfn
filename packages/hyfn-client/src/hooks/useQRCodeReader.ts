import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";

export const useQRCodeReader = ({
  setConfirmationCode,
}: {
  setConfirmationCode: any;
}) => {
  const [qrCode, setQRCode] = useState<any>(null);
  //   useEffect(() => {
  //     console.log(qrCode)
  //     const myElem = document.getElementById('reader')
  //     console.log('🚀 ~ file: useQRCodeReader.ts:9 ~ useEffect ~ myElem', myElem)
  //     if (myElem && qrCode === null) {
  //       const qrCode = new Html5Qrcode(/* element id */ 'reader')
  //       console.log(qrCode)

  //       setQRCode(qrCode)
  //     }
  //   })
  const initializeCamera = () => {
    const qrCode = new Html5Qrcode(/* element id */ "reader");
    //       console.log(qrCode)

    const qrCodeSuccessCallback = (decodedText: any, decodedResult: any) => {
      setConfirmationCode(decodedText);
      // console.log('🚀 ~ file: Home.tsx ~ line 93 ~ qrCodeSuccessCallback ~ decodedResult', decodedResult)
      console.log(
        "🚀 ~ file: Home.tsx ~ line 93 ~ qrCodeSuccessCallback ~ decodedText",
        decodedText
      );

      qrCode
        .stop()
        .then((ignore) => {
          console.log("stopped");
        })
        .catch((error) => {
          console.warn(`${error}`);
        });

      /* handle success */
    };
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    // If you want to prefer front camera

    // If you want to prefer back camera
    setQRCode(qrCode);

    qrCode.start(
      { facingMode: "environment" },
      config,
      qrCodeSuccessCallback,
      (error) => console.log(`${error}`)
    );
  };
  const stopCamera = () => {
    if (!qrCode) {
      return;
    }
    console.log(
      "🚀 ~ file: useQRCodeReader.ts:63 ~ stopCamera ~ qrCode:",
      qrCode
    );
    const status = qrCode.getState();
    console.log(
      "🚀 ~ file: useQRCodeReader.ts:63 ~ stopCamera ~ status:",
      status
    );
    if (status === 1) {
      return;
    }
    qrCode
      .stop()
      .then((ignore: any) => {
        console.log("stopped");
        qrCode.clear();
      })
      .catch((error: any) => {
        console.warn(`${error}`);
      });

    return;
    // qrCode
    //   .stop()
    //   .then((ignore) => {
    //     console.log(ignore)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
  };
  return { initializeCamera, stopCamera };
};
