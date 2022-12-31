import { Price } from "@functions/fuelPrice/types";

export const buildResponse = (price: Price, address: string) => {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "We found the latest lowest price for you! :v:",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*:fuelpump: Type:*\n${price.type}`,
          },
          {
            type: "mrkdwn",
            text: `*:moneybag: Price:*\n$${price.price.toFixed(2)}/100L`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*:round_pushpin: Address:*\n${address}`,
          },
          {
            type: "mrkdwn",
            text: `*:world_map: Location*\n${price.location.lat}, ${price.location.lng}`,
          },
        ],
      },
    ],
  };
};
