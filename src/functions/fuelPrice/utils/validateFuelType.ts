export const validateFuelType = (
  targetFuelType,
  defaultFuelType
): string | undefined => {
  const fuelType = targetFuelType ?? defaultFuelType;
  const validFuelTypes = ["E10", "U91", "U95", "U98", "Diesel", "LPG"];

  if (validFuelTypes.includes(fuelType)) {
    return fuelType;
  }

  return undefined;
};
