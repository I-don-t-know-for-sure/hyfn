import { useEffect } from 'react'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import { BSON } from 'realm-web'

declare global {
  interface Window {
    Lightbox: any
  }
}

export const usePayWithLocalCard = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = import.meta.env.VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL
    // script.async = true;
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // useEffect(() => {
  //   if (load) {
  //     window.Lightbox.Checkout.configure = {
  //       MID: '10081014649',
  //       TID: '99179395',
  //       AmountTrxn: 10000,
  //       MerchantReference: 'bhbhbh',
  //       TrxDateTime: `${now.toUTCString()}`,

  //       SecureHash: hashed,
  //       completeCallback: function (data) {
  //         console.log('🚀 ~ file: usePayWithLocalCard.ts ~ line 63 ~ useEffect ~ data success', data);
  //       },
  //       errorCallback: function (error) {
  //         console.log(error);
  //       },
  //       cancelCallback: function () {
  //         console.log('cancel');
  //       },
  //     };
  //     window.Lightbox.Checkout.showPaymentPage();
  //   }
  // });
}
