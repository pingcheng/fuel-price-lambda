import { FuelPriceMessage } from "@functions/fuelPrice/types";
import * as console from "console";

export const validateMessage = (message: FuelPriceMessage): string[] => {
  console.log("Try to validate message");
  const errors = [];

  if (!validateFuelType(message.data.fuelType)) {
    errors.push(
      `Fuel type "${message.data.fuelType}" is not a valid fuel type`
    );
  }
  console.log(`${errors.length} errors found on message validation`, errors);

  return errors;
};

const validateFuelType = (fuelType): boolean => {
  return ["E10", "U91", "U95", "U98", "Diesel", "LPG"].includes(fuelType);
};
