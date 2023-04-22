import axios from 'axios';

export const generateProductDescription = async ({ arg }: { arg: any }) => {
  const { products, storeId } = arg[0];
  console.log(
    '🚀 ~ file: generateProductDescription.ts:31 ~ generateProductDescription ~ r:',
    JSON.stringify(arg)
  );
  console.log(
    '🚀 ~ file: generateProductDescription.ts:31 ~ generateProductDescription ~ r:',
    JSON.stringify({
      products,
      storeId,
      eventBusName: process.env.generateProductDescriptionEventBus,
    })
  );

  axios
    .post(process.env.generateProductDescriptionUrl, {
      products,
      storeId,
      url: process.env.generateProductDescriptionUrl,
      eventBusName: process.env.generateProductDescriptionEventBus,
    })
    .catch((err) => {
      console.log(
        '🚀 ~ file: generateProductDescription.ts:24 ~ generateProductDescription ~ err:',
        err
      );
    });

  /* console.log('🚀 ~ file: generateProductDescription.ts:31 ~ generateProductDescription ~ r:', {
    EventBusName: process.env.generateProductDescriptionEventBus,
    DetailType: process.env.generateProductDescriptionEventBusDetailType,
    Source: process.env.generateProductDescriptionEventBusSource,
  });
  try {
    const eventBridge = new AWS.EventBridge({
      region: process.env.region,
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    });
    const params = {
      Entries: [
        {
          Detail: JSON.stringify({
            products,
            storeId,
            eventBusName: process.env.generateProductDescriptionEventBus,
          }),
          EventBusName: process.env.generateProductDescriptionEventBus,
          DetailType: process.env.generateProductDescriptionEventBusDetailType,
          Source: process.env.generateProductDescriptionEventBusSource,
        },
      ],
    };
    console.log('🚀 ~ file: generateProductDescription.ts:31 ~ generateProductDescription ~ r:', {
      EventBusName: process.env.generateProductDescriptionEventBus,
      DetailType: process.env.generateProductDescriptionEventBusDetailType,
      Source: process.env.generateProductDescriptionEventBusSource,
    });
    // put the event async
    // await eventBridge.putEvents(params).promise();
    eventBridge
      .putEvents(params)
      .promise()
      .then((res) => {
        console.log(
          '🚀 ~ file: generateProductDescription.ts:41 ~ generateProductDescription ~ res:',
          res
        );
        return;
      })
      .catch((err) => {
        console.log('🚀 ~ file: generateProductDescription.ts:55 ~ .then ~ err:', err);
      });

    console.log('🚀 ~ file: generateProductDescription.ts:31 ~ generateProductDescription ~ r:', {
      test: 'dhcbdhbcdb',
    });

    // try {
    //   const result = await eventBridge.putEvents(params).promise();
    //   console.log(
    //     '🚀 ~ file: generateProductDescription.ts:34 ~ generateProductDescription ~ result:',
    //     result
    //   );
    // } catch (error) {
    //   console.log(
    //     '🚀 ~ file: generateProductDescription.ts:35 ~ generateProductDescription ~ error:',
    //     error
    //   );
    // }
  } catch (error) {
    console.log(
      '🚀 ~ file: generateProductDescription.ts:25 ~ generateProductDescription ~ error:',
      error
    );
  } */
};
