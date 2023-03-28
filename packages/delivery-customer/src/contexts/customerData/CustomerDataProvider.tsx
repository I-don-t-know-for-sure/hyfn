import { useLocalStorage } from '@mantine/hooks';
import { useUser } from 'contexts/userContext/User';
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

// import { UserContextApi } from "./types";
// userInfo : {}
// updaters: () => {}

export const CustomerDataContext = createContext<CustomerData>(undefined);

interface CustomerData {
  customerData: {
    likedProducts: { storeId: string; _id: string }[];
    storeRatings: { _id: string; rating: number }[];
  };
  updateLikes: (storeId: string, productId: string) => void;
  updateRatings: (storeId: string, rating: number) => void;
  refetch: any;
  cancelRating: (storeId: string) => void;
}

const CustomerDataProvider: React.FC = ({ children }) => {
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
  const [customerData, setCustomerData] = useLocalStorage<{
    likedProducts: { storeId: string; _id: string }[];
    storeRatings: { _id: string; rating: number }[];
  }>({
    key: 'customerdata',
    defaultValue: { likedProducts: [], storeRatings: [] },
  });

  const { userId, userDocument: data, isLoading, refetch } = useUser();

  useEffect(() => {
    if (data) {
      setCustomerData(data);
    }
  }, [data, isLoading]);

  const updateLikes = (storeId: string, productId: string) => {
    const didCustomerLikeProduct = customerData.likedProducts.find((product) => product._id === productId);
    if (didCustomerLikeProduct) {
      const updatedProducts = customerData.likedProducts.filter((product) => {
        return product._id !== productId;
      });
      setCustomerData({ ...customerData, likedProducts: updatedProducts });
      return;
    }

    setCustomerData({
      ...customerData,
      likedProducts: [...customerData.likedProducts, { storeId, _id: productId }],
    });
  };

  const updateRatings = (storeId: string, rating: number) => {
    const didCustmerRateStore = customerData.storeRatings.find((store) => storeId === store._id);

    if (didCustmerRateStore) {
      const updatedRatings = customerData.storeRatings.map((store) => {
        if (storeId === store._id) {
          return { _id: storeId, rating };
        }
        return store;
      });
      setCustomerData({ ...customerData, storeRatings: updatedRatings });
      return;
    }

    setCustomerData({
      ...customerData,
      storeRatings: [...customerData.storeRatings, { _id: storeId, rating }],
    });
  };

  const cancelRating = (storeId: string) => {
    setCustomerData({
      ...customerData,
      storeRatings: customerData.storeRatings.filter((store) => store._id !== storeId),
    });
  };
  const context: CustomerData = {
    customerData,
    updateLikes,
    updateRatings,
    cancelRating,
    refetch,
  };

  return <CustomerDataContext.Provider value={context}>{children}</CustomerDataContext.Provider>;
};

export const useCustomerData = (): CustomerData => {
  const customerData = useContext(CustomerDataContext);
  if (!customerData) {
    throw new Error('call inside the component tree');
  }

  return customerData;
};

export default CustomerDataProvider;
