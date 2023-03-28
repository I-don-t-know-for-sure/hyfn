import {KMS} from 'aws-sdk';

export const decryptData = async ({
  data,
  kmsClient,
  kmsKeyARN,
}: {
  data: string;
  kmsKeyARN: string;
  kmsClient: KMS;
}) => {
  const buff = Buffer.from(data, 'base64');
  const decrypted = await kmsClient
    .decrypt({
      KeyId: kmsKeyARN,
      CiphertextBlob: buff,
    })
    .promise();

  const { Plaintext } = decrypted;
  if (!Plaintext) {
    throw new Error('decrypted value is undefined');
  }
  console.log(Plaintext.toString(), 'shshshshsshsh');
  console.log('shshshshsshsh');

  return Plaintext.toString();
};
