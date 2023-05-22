import { useEffect } from "react";

declare global {
  interface Window {
    Lightbox: any;
  }
}

export const usePayWithLocalCard = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL;
    // script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
};
