import { SQSBatchResponse, SQSEvent } from "aws-lambda";
import * as console from "console";
import { handle } from "@functions/fuelPrice/handlers/handler";

export const main = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const records = event.Records;
  const batchItemFailures = [];

  for (const record of records) {
    try {
      await handle(record);
    } catch (e) {
      console.log(`Failed to process ${record.messageId}`, e);
      batchItemFailures.push(record.messageId);
    }
  }

  return {
    batchItemFailures,
  };
};
