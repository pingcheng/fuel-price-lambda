import { Price } from "@functions/fuelPrice/types";

type BuildResponseConfig = {
  price: Price;
  address: string;
  userId?: string;
  publicMessage?: boolean;
};

export const buildResponse = ({
  price,
  address,
  userId = undefined,
  publicMessage = false,
}: BuildResponseConfig) => {
  let greetingMessage = "We found the latest lowest price for you! :v:";

  if (userId) {
    greetingMessage = `Hi <@${userId}>\n${greetingMessage}`;
  }

  return {
    response_type: publicMessage ? "in_channel" : "ephemeral",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: greetingMessage,
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
