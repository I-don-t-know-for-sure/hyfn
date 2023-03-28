import { useWindowScroll } from '@mantine/hooks'
import { useEffect } from 'react'

export const usePagination = (fetchNextPage: (any: any) => void, data: any) => {
  const [scroll] = useWindowScroll()
  useEffect(() => {
    console.log(window.innerHeight + window.scrollY >= document.body.offsetHeight)

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && Array.isArray(data?.pages)) {
      fetchNextPage({
        pageParam: data?.pages[data?.pages?.length - 1][data?.pages[data.pages?.length - 1]?.length - 1]?._id,
      })
    }
  }, [scroll])
}
