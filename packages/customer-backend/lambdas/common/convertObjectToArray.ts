export const convertObjectToArray = (object) => {
  const test = Object.keys(object).map((storeKey) => {
    const store = object[storeKey];

    return {
      ...store,
    };
  });
  console.log('🚀 ~ file: convertObjectToArray.js ~ line 9 ~ test ~ test', test);

  return test;
};
