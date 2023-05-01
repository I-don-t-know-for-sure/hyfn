import { deliveryServiceFee, storeAndCustomerServiceFee, storeServiceFee } from 'hyfn-types';
import { convertObjectToArray } from './convertObjectToArray';
export const calculateOrderCostWithoutUpdatingDistance = async ({
  orderArray,
  orderObject,
  coordinates,
  buyerCoords,
  drivingDurationInMinutes,
}) => {
  //   console.log(
  //     '🚀 ~ file: calculateOrderCost.js ~ line 6 ~ calculateOrdercost ~ coordinates',
  //     coordinates
  //   );
  //   async function getDeliveryDetails() {
  //     const deliveryUrl = coordinates.reduce(
  //       (accum, point) => `${accum};${point[0]},${point[1]}`,
  //       `${buyerCoords[0]},${buyerCoords[1]}`
  //     );
  //     // return { orderCart, buyerInfo, orders, deliveryUrl };
  //     const deliveryDetails = await axios({
  //       method: 'get',
  //       url: `https://api.mapbox.com/directions/v5/mapbox/driving/${deliveryUrl}?annotations=maxspeed&overview=full&geometries=geojson&access_token=pk.eyJ1IjoiYmFyaW9teW1lbiIsImEiOiJjbDFrcXRnaHowM2lxM2Jtb3h3Z2J4bDQ0In0.DKfCj0bt3QfE9QgacrWnpA`,
  //     });
  //     console.log(deliveryUrl);
  //     return deliveryDetails;
  //   }
  //   const deliveryDetails = await getDeliveryDetails();
  //   console.log(
  //     '🚀 ~ file: calculateOrderCost.js ~ line 25 ~ calculateOrdercost ~ deliveryDetails',
  //     deliveryDetails.data
  //   );
  let storesArray;
  if (orderArray && Array.isArray(orderArray)) {
    storesArray = orderArray;
  } else {
    storesArray = convertObjectToArray(orderObject);
  }
  console.log(
    '🚀 ~ file: calculateOrderCost.js ~ line 26 ~ calculateOrdercost ~ storesArray',
    storesArray,
    orderObject
  );
  // const deliveryFee = deliveryDetails.data.routes[0].distance * 0.0001
  const allStoresDurations = storesArray.reduce((accu, store) => {
    const storeTotalDuration = store.addedProducts.reduce((accu, product) => {
      return accu + 1;
    }, 3);
    return accu + storeTotalDuration;
  }, 0);
  const durationInMinutes = allStoresDurations + drivingDurationInMinutes;
  const deliveryFee = (durationInMinutes / 60) * 30;
  const orderCost = storesArray.reduce((accu, store) => {
    const storeTotal = store.addedProducts?.reduce(
      (acc, product) => acc + product.pricing.price * product.qty,
      0
    );
    return accu + storeTotal;
  }, 0);
  // order cost after our fee
  const orderCostAfterFee = orderCost - orderCost * storeServiceFee;
  // delivery fee after our fee
  const deliveryFeeAfterFee = deliveryFee - deliveryFee * deliveryServiceFee;
  // our service fee
  const serviceFee = orderCost * storeAndCustomerServiceFee + deliveryFee * deliveryServiceFee;
  // total cost of the order
  const totalCost = orderCostAfterFee + serviceFee + deliveryFeeAfterFee;
  console.log(orderCost, JSON.stringify(storesArray));
  return {
    orderCostAfterFee,
    deliveryFeeAfterFee,
    serviceFee,
    totalCost,
    durationInMinutes,
    allStoresDurations,
  };
};
