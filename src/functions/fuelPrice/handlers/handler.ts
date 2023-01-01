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
  // step 1. parse and check the message
  console.log("Start to process message", record.body);
  const message = parseMessage(record.body);

  if (isEmpty(message.destination.url)) {
    throw new Error("Did not find a destination block");
  }

  // step 2. validate the message content
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

  // step 3. call apis to fetch required data
  const data = message.data;

  console.log(`Start to get cheapest price for ${data.fuelType}`);
  const price = await getCheapestPrice(data.fuelType);

  console.log(`Try to parse address for`, price.location);
  const addressString = await getAddress(price.location);

  // step 4. reply to slack
  const response = buildResponse({
    price,
    address: addressString,
    userId: data.userId,
    publicMessage: data.publicMessage === true,
  });
  console.log(response);

  await sendRequest(message.destination, response);
};
