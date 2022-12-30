import {SQSBatchResponse, SQSEvent} from "aws-lambda";
import * as console from "console";
import {getCheapestPrice} from "@functions/fuelPrice/dataSources/projectZeroThree/projectZeroThree";
import {getAddress} from "@functions/fuelPrice/dataSources/positionStack/positionStack";
import axios from "axios";

export const main = async (event: SQSEvent): Promise<SQSBatchResponse> => {

  const records = event.Records;
  const batchItemFailures = []

  for (let record of records) {
    try {
      const message = JSON.parse(record.body);

      if (!message.response_url) {
        throw new Error('Did not find a slack response url');
      }

      const price = await getCheapestPrice();
      let addressString = await getAddress(price.location);

      if (!addressString) {
        addressString = `${price.location.lat}, ${price.location.lng}`;
      }

      const response = `Found the lowest price ${price.price} for ${price.type}, address - ${addressString}`;
      console.log(response);

      await axios.post(message.response_url, {
        "replace_original": true,
        "text": response
      })
    } catch (e) {
      console.log(`Failed to process ${record.messageId}`, e);
      batchItemFailures.push(record.messageId);
    }
  }

  return {
    batchItemFailures
  }
}