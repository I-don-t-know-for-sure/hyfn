import { createContext, useContext } from "react";
// import { UserContextApi } from "./types";
// userInfo : {}
// updaters: () => {}

export const SearchContext = createContext(undefined);

const SearchProvider: React.FC<{ children?: React.ReactNode }> = ({
  children
}) => {
  return <SearchContext.Provider value={""}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const search = useContext(SearchContext);
  if (!search) {
    throw new Error("call inside the component tree");
  }

  return search;
};

export default SearchProvider;
