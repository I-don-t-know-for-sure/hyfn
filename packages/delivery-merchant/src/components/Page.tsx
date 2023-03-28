import { Loader } from '@mantine/core'
import { useUser } from 'contexts/userContext/User'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'

function Page({ children }: { children: JSX.Element }) {
  const { userDocument: user, isLoading, loggedIn } = useUser()

  // // const { data, isLoading, isFetched } = useGetUserInfo()
  // const navigate = useNavigate()
  // const location = useLocation()
  // const [skipOnce, setSkipOnce] = useState(true)

  // console.log(user)
  // const userHasDocument = typeof user === 'object' ? Object.keys(user).length > 0 : false

  // useEffect(() => {
  //   // if (!skipOnce) {
  //   if (!isLoading) {
  //     console.log('🚀 ~ file: useUserCheck.ts:17 ~ useEffect ~ loggedIn', loggedIn)
  //     if (!loggedIn) {
  //       if (location.pathname === '/signup' || location.pathname === '/login') {
  //         return
  //       }
  //       navigate('/signup', { replace: true })
  //       console.log('🚀 ~ file: useUserCheck.ts:2525252525252525252525252525252525 ~ useEffect ~ loggedIn', loggedIn)
  //       return
  //     }
  //     console.log('🚀 ~ file: useUserCheck.ts:2525252525252525252525252525252525 ~ useEffect ~ loggedIn', loggedIn)
  //     if (!isLoading) {
  //       // if (!data) {
  //       //   navigate('/signup', { replace: true })
  //       // }
  //       console.log(
  //         '🚀 ~ file: useUserCheck.ts:29292929292929292929292929292929292929 ~ useEffect ~ loggedIn',
  //         loggedIn,
  //       )
  //       if (userHasDocument) {
  //         return
  //       }

  //       console.log(
  //         '🚀 ~ file: useUserCheck.ts:34343434343434343434343434343434343434343434 ~ useEffect ~ loggedIn',
  //         loggedIn,
  //       )
  //       if (!userHasDocument) {
  //         navigate('/createstore', { replace: true })
  //         return
  //       }
  //     }
  //   }
  //   // }
  //   setSkipOnce(false)
  // }, [isLoading, location.pathname, user])
  return isLoading && !user ? <Loader /> : children
}

export default Page
