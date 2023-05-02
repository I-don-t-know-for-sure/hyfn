import axios from 'axios';

export const handler = async (event) => {
  axios.post(process.env.url, event.detail);
};
