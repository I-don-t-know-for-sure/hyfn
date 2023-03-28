import { useLocalStorage } from '@mantine/hooks';
import { useUser } from 'contexts/userContext/User';
import { createContext, useContext } from 'react';
import { useMutation } from 'react-query';

// import { UserContextApi } from "./types";
// userInfo : {}
// updaters: () => {}

interface Location {
  city: string;
  country: string;
  coords: any;
  address?: string;
}

export const LocationContext =
  createContext<[location: Location, setLocaition: (val: Location | ((prevState: Location) => Location)) => void]>(
    undefined,
  );

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
    deserialize(value) {
      const parsedValue = JSON.parse(value);
      return { ...parsedValue, coords: [parseFloat(parsedValue.coords[0]), parseFloat(parsedValue.coords[1])] };
    },
  });
  return <LocationContext.Provider value={[location, setLocation]}>{children}</LocationContext.Provider>;
};

export const useLocation = (): [
  location: Location,
  setLocaition: (val: Location | ((prevState: Location) => Location)) => void,
] => {
  const location = useContext(LocationContext);

  if (!location) {
    throw new Error('call inside the component tree');
  }

  return location;
};

export const useUpdateLocation = () => {
  const { userId, userDocument, isLoading, refetch } = useUser();

  const [, setLocaition] = useLocation();

  return useMutation('location', async (location: Location) => {
    // try {
    //   await user.functions.updateLocation([location, userDocument]);
    //   setLocaition(location);
    // } catch (e) {
    //   console.error(JSON.stringify(e));
    // }
  });
};

export default LocationProvider;
