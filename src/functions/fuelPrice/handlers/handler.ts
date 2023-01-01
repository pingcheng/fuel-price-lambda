import { SQSRecord } from "aws-lambda";
import { getCheapestPrice } from "@functions/fuelPrice/apis/projectZeroThree/projectZeroThree";
import { getAddress } from "@functions/fuelPrice/apis/positionStack/positionStack";
import axios from "axios";
import { buildResponse } from "@functions/fuelPrice/utils/buildResponse";
import { validateFuelType } from "@functions/fuelPrice/utils/validateFuelType";
import { buildErrorResponse } from "@functions/fuelPrice/utils/buildErrorResponse";

export const handle = async (record: SQSRecord): Promise<void> => {
  console.log("Start to process message", record.body);
  const message = JSON.parse(record.body);

  if (!message.destination) {
    throw new Error("Did not find a destination block");
  }

  const data = message.data ?? {};

  console.log("Try to validate fuel type");
  const fuelType = validateFuelType(data.fuelType, "U91");
  if (!fuelType) {
    console.log(`Fuel type "${data.fuelType} is not a valid fuel type`);
    await axios.request({
      method: message.destination.method,
      url: message.destination.url,
      data: buildErrorResponse({
        message: `ERROR: "${data.fuelType}" is not a valid fuel type.`,
      }),
    });
    return;
  }

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
