const getStoresCoords = (orderCart: any) => {
  const metchesOrder = orderCart[0];
  const { country, city } = metchesOrder;

  if (!Array.isArray(orderCart)) {
    throw new Error("wrong");
  }

  const coordinates = orderCart?.map((store) => {
    if (store.country !== country && store.city !== city) {
      throw new Error("can not order from different cities or countries ");
    }

    return store.coords.coordinates;
  });

  return coordinates;
};

export default getStoresCoords;
