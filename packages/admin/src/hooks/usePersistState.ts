import { useEffect, useState } from "react";

interface UsePersistStateOptions {
  localStorageKey: string;
  hydrate?: (value: any) => any;
  dehydrate?: (value: any) => any;
}

/**
 * Same as "useState" but saves the value to local storage each time it changes
 */
const usePersistState = (
  initialValue: any,
  userOptions: UsePersistStateOptions
) => {
  const { localStorageKey } = userOptions;
  const [value, setValue] = useState(() => {
    try {
      const valueFromLS = localStorage.getItem(localStorageKey);

      return valueFromLS ? JSON.parse(valueFromLS) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value, localStorageKey]);

  return [value, setValue];
};

export default usePersistState;
