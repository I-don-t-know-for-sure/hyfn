import { useDebouncedValue } from "@mantine/hooks";
import { useLocation } from "contexts/locationContext/LocationContext";

import { createContext, useContext, useMemo, useState } from "react";

import { fetchApi } from "util/fetch";
// import { UserContextApi } from "./types";
// userInfo : {}
// updaters: () => {}

interface SearchContextType {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  searchMode: boolean;
  setSearchMode: React.Dispatch<React.SetStateAction<boolean>>;
  debouncedSearch: string;

  hits: any[];
}

export const SearchContext = createContext(undefined);

const SearchProvider: React.FC<{ children?: React.ReactNode }> = ({
  children
}) => {
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [hits, setHits] = useState([]);
  const [location] = useLocation();

  useMemo(async () => {
    if (debouncedSearch) {
      // const hits = await fetchApi({
      //   arg: [
      //     {
      //       country: location.country,
      //       searchType: "product",
      //       searchValue: debouncedSearch,
      //     },
      //   ],
      //   url: "",
      // });

      setHits([]);
    }
  }, [debouncedSearch, location.city, location.country]);

  const values: SearchContextType = {
    search,
    setSearch,
    searchMode,
    setSearchMode,
    debouncedSearch,

    hits
  };

  return (
    <SearchContext.Provider value={values}>{children}</SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const search = useContext(SearchContext);
  if (!search) {
    throw new Error("call inside the component tree");
  }

  return search;
};

export default SearchProvider;
