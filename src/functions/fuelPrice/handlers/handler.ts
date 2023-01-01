import { SQSRecord } from "aws-lambda";
import { getCheapestPrice } from "@functions/fuelPrice/apis/projectZeroThree/projectZeroThree";
import { getAddress } from "@functions/fuelPrice/apis/positionStack/positionStack";
import { buildResponse } from "@functions/fuelPrice/utils/buildResponse";
import { buildErrorResponse } from "@functions/fuelPrice/utils/buildErrorResponse";
import { sendRequest } from "@functions/fuelPrice/utils/sendRequest";
import { parseMessage } from "@functions/fuelPrice/utils/parseMessage";
import { isEmpty } from "lodash";
import { validateMessage } from "@functions/fuelPrice/utils/validateMessage";

export const handle = async (record: SQSRecord): Promise<void> => {
  console.log("Start to process message", record.body);
  const message = parseMessage(record.body);

  if (isEmpty(message.destination.url)) {
    throw new Error("Did not find a destination block");
  }

  // verify the message
  console.log("Try to validate message");
  const errors = validateMessage(message);
  if (errors.length > 0) {
    return await sendRequest(
      message.destination,
      buildErrorResponse({
        message: `Errors:\n${errors.join("\n")}`,
      })
    );
  }

  const data = message.data;

  // call api to get the cheapest fuel type
  console.log(`Start to get cheapest price for ${data.fuelType}`);
  const price = await getCheapestPrice(data.fuelType);

  // call api to parse the address
  console.log(`Try to parse address for`, price.location);
  const addressString = await getAddress(price.location);

  const response = buildResponse({
    price,
    address: addressString,
    userId: data.userId,
    publicMessage: data.publicMessage === true,
  });
  console.log(response);

  await sendRequest(message.destination, response);
};
