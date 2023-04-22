import AWS from 'aws-sdk';
import axios from 'axios';

export function sendRemoveBackgroundsEventBus({
  productIds,
  storeId,
}: {
  productIds: any[];
  storeId: string;
}) {
  /*  const eventBridge = new AWS.EventBridge();
  const params = {
    Entries: [
      {
        Detail: JSON.stringify({
          productIds,
          eventBusName: process.env.backgroundRemovalEventBus,
          storeId,
        }),
        EventBusName: process.env.backgroundRemovalEventBus,
        DetailType: process.env.backgroundRemovalEventBusDetailType,
        Source: process.env.backgroundRemovalEventBusSource,
      },
    ],
  };
  // put the event async
  // await eventBridge.putEvents(params).promise();
  eventBridge.putEvents(params, function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data);
    }
  }); */

  console.log({ productIds, storeId, url: process.env.removeBackgroundsURL });

  axios
    .post(process.env.removeBackgroundsURL, {
      productIds,
      storeId,
      url: process.env.removeBackgroundsURL,
    })
    .catch((err) => {
      console.log(err);
    });
}
export const removeBackgrounds = async ({
  productIds,
  storeId,
}: {
  productIds: string[];
  storeId: string;
}) => {
  sendRemoveBackgroundsEventBus({ productIds, storeId });
};
