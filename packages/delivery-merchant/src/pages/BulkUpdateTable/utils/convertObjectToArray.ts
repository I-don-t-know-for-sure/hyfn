export const convertObjectToArray = (obj: any) => {
  const array = [];
  Object.keys(obj).map((key) => {
    array.push(obj[key]);
  });

  return array;
};
