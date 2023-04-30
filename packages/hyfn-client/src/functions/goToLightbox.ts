export function goToLightbox({
  colorScheme,
  data,
  validationUrl,
  paymentAppUrl,
}: {
  data: any;
  validationUrl: string;
  paymentAppUrl: string;
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
      url: `${validationUrl}`,
      colorScheme,
    }).toString();
  window.open(`${paymentAppUrl}` + queryString);
}
