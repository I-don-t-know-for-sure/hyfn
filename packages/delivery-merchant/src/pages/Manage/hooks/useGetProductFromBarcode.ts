import { barcodeSearch } from 'config/constants'
import { useQuery } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useGetProductsFromBarcode = ({ searchString }: { searchString: string }) => {
  return useQuery(
    [barcodeSearch, searchString],
    async () => {
      try {
        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/getProductFromBarcode`,
          reqData: [{ searchString }],
        })
        return result
      } catch (error) {
        console.log(error)
      }
    },
    {
      enabled: !!searchString,
    },
  )
}
