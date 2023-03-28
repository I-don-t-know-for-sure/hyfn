import useUploadImage from 'hooks/useUploadImage'

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query'
import { showNotification, updateNotification } from '@mantine/notifications'

import { ProductInfo } from '../types'
import { randomId } from '@mantine/hooks'
import fetchUtil from 'utils/fetch'
import { t } from 'utils/i18nextFix'
import { useUser } from 'contexts/userContext/User'

export const useCreateProduct = () => {
  const { userId, userDocument } = useUser()

  const upload = useUploadImage()

  const result = useMutation('product', async ({ productLibraryImages, ...product }: ProductInfo) => {
    try {
      const randomid = randomId()
      showNotification({
        id: randomid,
        title: `creating ${product.textInfo.title}`,
        message: `creating ${product.textInfo.title}`,
        loading: true,
        autoClose: false,
      })
      //const { country, city, id } = user?.customData.storeDoc as {
      //city: String;
      //country: string;
      //   id: string;
      // };

      const imagesURLs = await upload(product.files)
      const libraryImages = Array.isArray(productLibraryImages) ? productLibraryImages : []

      const data = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/createProduct`,

        reqData: [
          {
            ...product,
            imagesURLs: [...imagesURLs, ...libraryImages],
          },
          userDocument?.storeDoc,
          userId,
        ],
      })

      // const res = await user?.functions.createProduct([
      //   { ...product, imagesURLs },
      //   user?.customData.storeDoc,
      // ]);

      updateNotification({
        id: randomid,
        title: `${product.textInfo.title} created`,
        message: `${product.textInfo.title} created`,
        loading: false,
        autoClose: 2000,
      })
      return data
    } catch (e) {
      console.error(e)
    }
  })
  return result
}
