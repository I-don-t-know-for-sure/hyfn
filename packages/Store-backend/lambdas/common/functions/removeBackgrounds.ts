import AWS from 'aws-sdk';
export function sendRemoveBackgroundsEventBus({
  imageKeys,
  storeId,
}: {
  imageKeys: any[];
  storeId: string;
}) {
  const eventBridge = new AWS.EventBridge();
  const params = {
    Entries: [
      {
        Detail: JSON.stringify({
          keys: imageKeys,
          eventBusName: process.env.backgroundRemovalEventBus,
          storeId,
        }),
        DetailType: 'background_removal',
        EventBusName: process.env.backgroundRemovalEventBus,
        Source: 'background_removal',
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
}
export const removeBackgrounds = async ({ keys, storeId }: { keys: string[]; storeId: string }) => {
  sendRemoveBackgroundsEventBus({ imageKeys: keys, storeId });
};
