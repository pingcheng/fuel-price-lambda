import { FuelPriceMessage } from "@functions/fuelPrice/types";
import { merge } from "lodash";

export const defaultMessage: FuelPriceMessage = {
  destination: {
    url: "",
    method: "post",
  },
  data: {
    fuelType: "",
    state: "all",
    publicMessage: false,
    userId: undefined,
  },
};

export const parseMessage = (message: string): FuelPriceMessage => {
  console.log("Start to parse message", message);
  const parsedMessage = JSON.parse(message);
  return merge(defaultMessage, parsedMessage);
};
