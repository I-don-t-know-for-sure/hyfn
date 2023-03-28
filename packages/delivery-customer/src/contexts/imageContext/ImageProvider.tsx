import { createContext, useContext } from 'react';
// import { UserContextApi } from "./types";
// userInfo : {}
// updaters: () => {}

export const ImageContext = createContext(undefined);

const ImageProvider: React.FC = ({ children }) => {
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
  //
  return (
    <ImageContext.Provider
      value={{
        url: `${import.meta.env.VITE_APP_BUCKET_URL}/`,
        screenSizes: ['mobile', 'tablet', 'laptop'],
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => {
  const image = useContext(ImageContext);
  if (!image) {
    throw new Error('call inside the component tree');
  }

  return image;
};

export default ImageProvider;
