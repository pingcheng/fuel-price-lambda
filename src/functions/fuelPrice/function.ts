import { SQSBatchItemFailure, SQSBatchResponse, SQSEvent } from "aws-lambda";
import { handle } from "@functions/fuelPrice/handlers/handler";

export const main = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const records = event.Records;
  const batchItemFailures: SQSBatchItemFailure[] = [];

  for (const record of records) {
    try {
      await handle(record);
    } catch (e) {
      console.log(`Failed to process ${record.messageId}`, e);
      batchItemFailures.push({
        itemIdentifier: record.messageId,
      });
    }
  }

  return {
    batchItemFailures,
  };
};
