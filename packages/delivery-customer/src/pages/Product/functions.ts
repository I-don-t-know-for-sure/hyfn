export const calculatePrecision = (measurementSystem: string) => {
  if (measurementSystem === "Kilo" || measurementSystem === "Liter") {
    return 2;
  }
  if (measurementSystem === "Unit") {
    return 0;
  }
};
export const calculateStep = (measurementSystem: string) => {
  if (measurementSystem === "Kilo" || measurementSystem === "Liter") {
    return 0.25;
  }
  if (measurementSystem === "Unit") {
    return 1;
  }
};
