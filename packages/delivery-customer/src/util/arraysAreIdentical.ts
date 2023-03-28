function arraysAreIdentical(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  const doubleArray2 = convertToNumber(arr2);
  const numberArray = convertToString(arr1);

  const sortedArr2 = doubleArray2.sort((a, b) => a[0] - b[0]);
  const sortedArr1 = numberArray.sort((a, b) => a[0] - b[0]);

  for (var i = 0, len = arr1.length; i < len; i++) {
    for (var x = 0; x < arr1[i].length; x++) {
      if (sortedArr1[i][x] !== sortedArr2[i][x]) {
        return false;
      }
    }
  }
  return true;
}

export default arraysAreIdentical;

const convertToNumber = (array) => {
  return array.map((oldArray) => {
    return [oldArray[0].$numberDouble, oldArray[1].$numberDouble];
  });
};

const convertToString = (array) => {
  return array.map((oldArray) => {
    return [`${oldArray[0]}`, `${oldArray[1]}`];
  });
};
