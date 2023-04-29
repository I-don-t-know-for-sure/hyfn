import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

export const useSubscribeToHyfnPlus = () => {
  return useMutation(async ({ numberOfMonths }: { numberOfMonths: number }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ numberOfMonths }],
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/createSubscriptionTransaction`,
      });
      goToLightbox({ data: result, colorScheme: "", validationUrl: "" });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useSubscribeToHyfnPlus.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};

function goToLightbox({
  colorScheme,
  data,
  validationUrl,
}: {
  data: any;
  validationUrl: string;
  colorScheme: string;
}) {
  const { configurationObject } = data;
  console.log(
    "🚀 ~ file: PayWithLocalCard.tsx ~ line 20 ~ useEffect ~ configurationObject",
    configurationObject
  );
  const queryString =
    "?" +
    new URLSearchParams({
      ...configurationObject,
      url: `${import.meta.env.VITE_APP_BASE_URL}/${validationUrl}`,
      colorScheme,
    }).toString();
  window.open(`${import.meta.env.VITE_APP_PAYMENT_APP_URL}` + queryString);
}
