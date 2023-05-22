export const convertObjectToArray = (object) => {
  const test = Object.keys(object).map((storeKey) => {
    const store = object[storeKey];
    return {
      ...store,
    };
  });

  return test;
};
