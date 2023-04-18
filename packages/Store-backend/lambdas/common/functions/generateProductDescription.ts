import axios from 'axios';
import AWS from 'aws-sdk';
export const generateProductDescription = async ({ arg }: { arg: any }) => {
  console.log(
    '🚀 ~ file: generateProductDescription.ts:31 ~ generateProductDescription ~ r:',
    JSON.stringify(arg)
  );
  console.log(
    '🚀 ~ file: generateProductDescription.ts:31 ~ generateProductDescription ~ r:',
    process.env.generateProductDescriptionEventBus
  );

  const { products, storeId } = arg[0];
  const eventBridge = new AWS.EventBridge();
  const params = {
    Entries: [
      {
        Detail: JSON.stringify({
          products,
          storeId,
          eventBusName: process.env.generateProductDescriptionEventBus,
        }),
        DetailType: 'generate_product_description',
        EventBusName: process.env.generateProductDescriptionEventBus,
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
