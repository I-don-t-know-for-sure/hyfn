
import { getAccessToken } from './getAccessToken'

const fetchUtil = async ({
  method = 'POST',
  reqData,
  url,
}: {
  method?: string
  reqData: any
  url: string
  user?: any
}) => {
  // const { id: userId, accessToken } = user;
  console.log(reqData)
  const accessTokenObject = await getAccessToken()
  return await fetch(url, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    // body: JSON.stringify([...reqData, { userId, accessToken }]),
    body: JSON.stringify([...reqData, accessTokenObject]),
  }).then(async (data) => {
    const result = await data.json()
    console.log(result)
    return result
  })
}

export default fetchUtil
