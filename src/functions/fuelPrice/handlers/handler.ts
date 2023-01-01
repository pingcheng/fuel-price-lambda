import { SQSRecord } from "aws-lambda";
import { getCheapestPrice } from "@functions/fuelPrice/dataSources/projectZeroThree/projectZeroThree";
import { getAddress } from "@functions/fuelPrice/dataSources/positionStack/positionStack";
import axios from "axios";
import { buildResponse } from "@functions/fuelPrice/handlers/responseBuilder";

export const handle = async (record: SQSRecord): Promise<void> => {
  console.log("Start to process message", record.body);
  const message = JSON.parse(record.body);

  if (!message.destination) {
    throw new Error("Did not find a destination block");
  }

  const data = message.data ?? {};
  const fuelType = data.fuelType ?? "U91";

  console.log(`Start to get cheapest price for ${fuelType}`);
  const price = await getCheapestPrice(fuelType);

  console.log(`Try to parse address for`, price.location);
  const addressString = await getAddress(price.location);

  const response = buildResponse({
    price,
    address: addressString,
    userId: data.userId,
    publicMessage: data.publicMessage === true,
  });
  console.log(response);

  await axios.request({
    method: message.destination.method,
    url: message.destination.url,
    data: response,
  });
};
