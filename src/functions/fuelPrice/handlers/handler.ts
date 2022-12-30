import { SQSRecord } from "aws-lambda";
import { getCheapestPrice } from "@functions/fuelPrice/dataSources/projectZeroThree/projectZeroThree";
import { getAddress } from "@functions/fuelPrice/dataSources/positionStack/positionStack";
import console from "console";
import axios from "axios";
import { buildResponse } from "@functions/fuelPrice/handlers/responseBuilder";

export const handle = async (record: SQSRecord): Promise<void> => {
  const message = JSON.parse(record.body);

  if (!message.response_url) {
    throw new Error("Did not find a slack response url");
  }

  const price = await getCheapestPrice();
  let addressString = await getAddress(price.location);

  if (!addressString) {
    addressString = `${price.location.lat}, ${price.location.lng}`;
  }

  const response = buildResponse(price, addressString);
  console.log(response);

  await axios.post(message.response_url, {
    text: response,
  });
};
