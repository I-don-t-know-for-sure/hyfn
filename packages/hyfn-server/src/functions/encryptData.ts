import {KMS}from "aws-sdk";

export const encryptData = async (
  data: string,
  kmsKeyARN: string,
  kmsClient: KMS
) => {
  const encrypted = await kmsClient
    .encrypt({
      KeyId: kmsKeyARN,
      Plaintext: data,
    })
    .promise();

  const { CiphertextBlob } = encrypted;
  if (!CiphertextBlob) {
    throw new Error("ecrypted value is undefined");
  }
  console.log(encrypted);
  return Buffer.from(CiphertextBlob as any).toString("base64");
};
