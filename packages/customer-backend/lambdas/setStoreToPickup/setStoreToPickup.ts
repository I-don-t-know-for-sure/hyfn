'use strict';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import { mainWrapperWithSession } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';

export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client }: MainFunctionProps) => {
    var result;

    const { country, orderId, storeId } = arg[0];

    console.log(arg);

    const orderDoc = await client
      .db('base')
      .collection('orders')
      .findOne(
        {
          _id: new ObjectId(orderId),
        },
        { session }
      );
    if (!orderDoc) {
      throw new Error('dchdb');
    }
    var storeCoords;

    const stores = orderDoc.orders.map((store) => {
      console.log(store._id === new ObjectId(storeId));
      if (store._id.toString() === storeId) {
        console.log(store.coords);
        storeCoords = store.coords;
        return { ...store, orderType: 'Pickup' };
      }
      return store;
    });
    console.log(storeCoords);
    const coords = orderDoc.coords.coordinates.filter((coord) => {
      console.log(coord, storeCoords);
      return coord[0] !== storeCoords.coordinates[0] && coord[1] !== storeCoords.coordinates[1];
    });
    console.log(coords);
    if (coords?.length === 0) {
      await client
        .db('base')
        .collection('orders')
        .updateOne(
          {
            _id: new ObjectId(orderId),
          },
          {
            $set: {
              orders: stores,

              duration: 0,
              distance: 0,
            },
          },
          { session }
        );
    }
    const deliveryUrl = coords.reduce(
      (accum, point) => `${accum};${point[0]},${point[1]}`,

      `${orderDoc.buyerCoords[0]},${orderDoc.buyerCoords[1]}`
    );

    const deliveryDetails = await axios({
      method: 'get',
      url: `https://api.mapbox.com/directions/v5/mapbox/driving/${deliveryUrl}?annotations=maxspeed&overview=full&geometries=geojson&access_token=pk.eyJ1IjoiYmFyaW9teW1lbiIsImEiOiJjbDFrcXRnaHowM2lxM2Jtb3h3Z2J4bDQ0In0.DKfCj0bt3QfE9QgacrWnpA`,
    });
    console.log(deliveryDetails.data.routes[0].duration, deliveryDetails.data.routes[0].distance);

    await client
      .db('base')
      .collection('orders')
      .updateOne(
        {
          _id: new ObjectId(orderId),
        },
        {
          $set: {
            'orders': stores,
            'coords.coordinates': coords,
            'duration': deliveryDetails.data.routes[0].duration,
            'distance': deliveryDetails.data.routes[0].distance,
          },
        },
        { session }
      );
    result = 'success';

    console.log(result);
    return result;
  };
  return await mainWrapperWithSession({
    mainFunction,

    event,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
