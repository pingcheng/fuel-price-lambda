import AWS from "aws-sdk";
import { Price } from "@functions/fuelPrice/types";
import { v4 as uuidV4 } from "uuid";
import { isEmpty } from "lodash";

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "ap-southeast-2",
  endpoint: isEmpty(process.env.AWS_ENDPOINT)
    ? process.env.AWS_ENDPOINT
    : undefined,
});

export const recordResponse = async (
  price: Price,
  addressString: string
): Promise<void> => {
  console.log("Record into dynamoDB");

  try {
    await dynamoDB
      .put({
        Item: {
          uuid: uuidV4(),
          type: price.type,
          price: price.price,
          latitude: price.location.lat,
          longitude: price.location.lng,
          address: addressString,
          timestamp: new Date().toISOString(),
        },
        TableName: "fuelPriceTable",
      })
      .promise();
  } catch (error) {
    console.error("Failed to record into dynamoDB", error);
  }
};
