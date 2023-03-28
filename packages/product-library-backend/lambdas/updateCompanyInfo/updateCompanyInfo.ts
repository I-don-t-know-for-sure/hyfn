"use strict";

import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { companyFrontId, id, city, country } = arg[0];
    const newInfo = arg[1];
    const { imgaeObj, ...newcompany } = newInfo;
    const mongo = client.db("base");
    const companyCollection = client
      .db("generalData")
      .collection(`companyInfo`);

    const coordsArray = newcompany.coords.split(",");

    console.log(JSON.stringify(coordsArray));
    if (Array.isArray(coordsArray)) {
      if (coordsArray.length === 2) {
        const float1 = parseFloat(coordsArray[0]);
        const float2 = parseFloat(coordsArray[1]);
        console.log(JSON.stringify(coordsArray));
        const coords = { type: "Point", coordinates: [float2, float1] };

        await companyCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: { ...newcompany, coords: coords },
          }
        );
      }
    }

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
