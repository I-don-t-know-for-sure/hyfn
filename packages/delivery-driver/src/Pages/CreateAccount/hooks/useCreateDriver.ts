import { Auth } from 'aws-amplify'
import { useUser } from 'contexts/userContext/User'
import { useGetUserDocument } from 'hooks/useGetUserDocument'
import { useMutation, useQueryClient } from 'react-query'
import fetchUtil from 'utils/fetch'

export const useCreateDriver = () => {
  // const { user, logOut } = useRealmApp()
  const { userId, refetch } = useUser()
  const queryClient = useQueryClient()
  return useMutation(
    async (driverInfo: any) => {
      try {
        fetchUtil({
          reqData: [driverInfo, userId],
          url: `${import.meta.env.VITE_APP_BASE_URL}/createDriverDocument`,
        })
        refetch()
      } catch (e) {
        console.error(e)
        // if (user) {
        //   await logOut()
        // }
      }
    },
    // {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries([userId])
    //   },
    // },
  )
}
