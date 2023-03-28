export const convertCoordsStringToArray = (coordsString: string) => {
  const coords = coordsString.split(',');
  return [parseFloat(coords[0]), parseFloat(coords[1])];
};
