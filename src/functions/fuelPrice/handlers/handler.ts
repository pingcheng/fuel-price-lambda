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

  const data = message.data ?? {};

  const price = await getCheapestPrice(data.fuelType ?? "U91");
  const addressString = await getAddress(price.location);

  const response = buildResponse({
    price,
    address: addressString,
    publicMessage: data.publicMessage === true,
  });
  console.log(response);

  await axios.request({
    method: message.destination.method,
    url: message.destination.url,
    data: response,
  });
};
