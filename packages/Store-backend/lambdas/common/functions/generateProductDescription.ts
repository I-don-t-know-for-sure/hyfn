import axios from 'axios';
import AWS from 'aws-sdk';
export const generateProductDescription = async ({ arg }: { arg: any }) => {
  console.log('🚀 ~ file: generateProductDescription.ts:31 ~ generateProductDescription ~ r:', arg);
  return;
  const products = arg[0].products;
  const eventBridge = new AWS.EventBridge();
  const params = {
    Entries: [
      {
        Detail: JSON.stringify({
          products,
          eventBusName: process.env.backgroundRemovalEventBus,
        }),
        DetailType: 'generate_product_description',
        EventBusName: process.env.backgroundRemovalEventBus,
        Source: 'generate_product_description',
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
  });
};
