import { getAccessToken } from './getAccessToken';

const fetchUtil = async ({ method = 'POST', reqData, url }: { method?: string; reqData: any; url: string }) => {
  const accessTokenObject = await getAccessToken();

  const data = await fetch(url, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify([...reqData, accessTokenObject]),
  });
  if (data.status !== 200) {
    throw new Error(data.statusText);
  }

  const result = await data.json();
  return result;
};

export default fetchUtil;
