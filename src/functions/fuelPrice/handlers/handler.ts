import { SQSRecord } from "aws-lambda";
import { getCheapestPrice } from "@functions/fuelPrice/dataSources/projectZeroThree/projectZeroThree";
import { getAddress } from "@functions/fuelPrice/dataSources/positionStack/positionStack";
import console from "console";
import axios from "axios";
import { buildResponse } from "@functions/fuelPrice/handlers/responseBuilder";

export const handle = async (record: SQSRecord): Promise<void> => {
  const message = JSON.parse(record.body);

  if (!message.destination) {
    throw new Error("Did not find a destination block");
  }

  const price = await getCheapestPrice();
  const addressString = await getAddress(price.location);

  const response = buildResponse(price, addressString);
  console.log(response);

  await axios.request({
    method: message.destination.method,
    url: message.destination.url,
    data: {
      text: response,
    },
  });
};
