import axios from 'axios';

export const generateProductDescription = async ({ arg }: { arg: any }) => {
  const url = process.env.generateProductDescription;
  try {
    axios.post(url, arg);
  } catch (error) {
    console.log(
      '🚀 ~ file: generateProductDescription.ts:9 ~ generateProductDescription ~ error:',
      error
    );
    throw new Error('error');
  }
};
