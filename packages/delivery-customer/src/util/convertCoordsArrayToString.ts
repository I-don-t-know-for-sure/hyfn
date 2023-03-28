export const convertCoordsArraytoString = (coordsArray: any) => {
  console.log(coordsArray);
  if (!Array.isArray(coordsArray)) {
    if (typeof coordsArray === 'string') {
      return coordsArray;
    }
  }

  return `${coordsArray[0]},${coordsArray[1]}`;
};
