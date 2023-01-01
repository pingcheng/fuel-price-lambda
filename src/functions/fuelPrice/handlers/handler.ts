import { SQSRecord } from "aws-lambda";
import { getCheapestPrice } from "@functions/fuelPrice/apis/projectZeroThree/projectZeroThree";
import { getAddress } from "@functions/fuelPrice/apis/positionStack/positionStack";
import { buildResponse } from "@functions/fuelPrice/utils/buildResponse";
import { validateFuelType } from "@functions/fuelPrice/utils/validateFuelType";
import { buildErrorResponse } from "@functions/fuelPrice/utils/buildErrorResponse";
import { sendRequest } from "@functions/fuelPrice/utils/sendRequest";
import { parseMessage } from "@functions/fuelPrice/utils/parseMessage";
import { isEmpty } from "lodash";

export const handle = async (record: SQSRecord): Promise<void> => {
  console.log("Start to process message", record.body);
  const message = parseMessage(record.body);

  if (isEmpty(message.destination.url)) {
    throw new Error("Did not find a destination block");
  }

  const data = message.data;

  // verify the fuel type
  console.log("Try to validate fuel type");
  const fuelType = validateFuelType(data.fuelType, "U91");
  if (!fuelType) {
    console.log(`Fuel type "${data.fuelType} is not a valid fuel type`);
    await sendRequest(
      message.destination,
      buildErrorResponse({
        message: `ERROR: "${data.fuelType}" is not a valid fuel type.`,
      })
    );
    return;
  }

  // call api to get the cheapest fuel type
  console.log(`Start to get cheapest price for ${fuelType}`);
  const price = await getCheapestPrice(fuelType);

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
