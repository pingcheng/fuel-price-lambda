import { FuelPriceMessage } from "@functions/fuelPrice/types";

export const validateMessage = (message: FuelPriceMessage): string[] => {
  const errors = [];

  if (!validateFuelType(message.data.fuelType)) {
    errors.push(
      `Fuel type "${message.data.fuelType}" is not a valid fuel type`
    );
  }

  return errors;
};

const validateFuelType = (fuelType): boolean => {
  return ["E10", "U91", "U95", "U98", "Diesel", "LPG"].includes(fuelType);
};
