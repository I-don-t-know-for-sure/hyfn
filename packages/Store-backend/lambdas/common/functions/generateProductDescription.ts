import axios from 'axios';

export const generateProductDescription = async ({ arg }: { arg: any }) => {
  const { products, storeId } = arg[0];

  axios
    .post(process.env.generateProductDescriptionUrl, {
      products,
      storeId,
      url: process.env.generateProductDescriptionUrl,
      eventBusName: process.env.generateProductDescriptionEventBus,
    })
    .catch((err) => {
      console.error(err);
    });
};
