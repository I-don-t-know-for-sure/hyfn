import axios from 'axios';

export const removeBackgrounds = async ({ keys }: { keys: string[] }) => {
  const url = process.env.removeBackgroundsURL;
  axios.post(url, { arg: [{ keys }] });
};
