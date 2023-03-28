import { UserContext } from 'contexts/UserContextOld/Provider'
import { UserContextApi } from 'contexts/UserContextOld/types'
import { useContext } from 'react'

const useUserInfo = (): UserContextApi => {
  const context = useContext(UserContext)
  return context
}

export default useUserInfo
