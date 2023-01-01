import { Destination } from "@functions/fuelPrice/types";
import axios from "axios";

export const sendRequest = async (
  destination: Destination,
  data
): Promise<void> => {
  await axios.request({
    method: destination.method,
    url: destination.url,
    data,
  });
};
