import { FuelPriceMessage } from "@functions/fuelPrice/types";
import { merge } from "lodash";

export const defaultMessage: FuelPriceMessage = {
  destination: {
    url: "",
    method: "post",
  },
  data: {
    fuelType: "",
    publicMessage: false,
    userId: undefined,
  },
};

export const parseMessage = (message: string): FuelPriceMessage => {
  const parsedMessage = JSON.parse(message);
  return merge(defaultMessage, parsedMessage);
};
