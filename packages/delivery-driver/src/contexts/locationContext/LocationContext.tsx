import { useLocalStorage } from '@mantine/hooks'
import { createContext, useContext } from 'react'
import { useMutation } from 'react-query'

// import { UserContextApi } from "./types";
// userInfo : {}
// updaters: () => {}

export const LocationContext = createContext(undefined)

const LocationProvider: React.FC = ({ children }) => {
  // make this type safe
  // const updateUserInfo = useCallback(
  //   (newInfo: any) => {
  //     newInfo);
  //     setUserInfo((prev) => {
  //       return { ...prev, ...newInfo };
  //     });
  //   },
  //   [setUserInfo]
  // );
  const [location, setLocation] = useLocalStorage({
    key: 'location',
    defaultValue: {
      city: 'Tripoli',
      country: 'Libya',
      coords: [3.33, 3.33],
    },
  })
  return <LocationContext.Provider value={[location, setLocation]}>{children}</LocationContext.Provider>
}

export const useLocation = (): [
  location: {
    city: string
    country: string
    coords: number[]
  },
  setLocaition: (
    val:
      | {
          city: string
          country: string
          coords: number[]
        }
      | ((prevState: { city: string; country: string; coords: number[] }) => {
          city: string
          country: string
          coords: number[]
        }),
  ) => void,
] => {
  const location = useContext(LocationContext)
  console.log(location)

  if (!location) {
    throw new Error('call inside the component tree')
  }

  return location
}

export const useUpdateLocation = () => {
  const [, setLocaition] = useLocation()

  return useMutation('location', async (location: { city: string; country: string; coords: number[] }) => {
    try {
      setLocaition(location)
    } catch (e) {
      console.error(JSON.stringify(e))
    }
  })
}

export default LocationProvider
