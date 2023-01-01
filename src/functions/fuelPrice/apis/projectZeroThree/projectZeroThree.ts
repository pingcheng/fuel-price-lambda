import { Price } from "@functions/fuelPrice/types";
import axios from "axios";

const ENDPOINT_URL = "https://projectzerothree.info/api.php?format=json";

export const getCheapestPrice = async (
  fuelType: string
): Promise<Price | undefined> => {
  console.log("Start to projectZeroThree to retrieve fuel prices");
  const response = await axios.get(ENDPOINT_URL);
  console.log("Received fuel prices");
  const regionAll = response.data.regions.find(
    (region) => region.region === "All"
  );
  const price = regionAll.prices.find(
    (price) => price.type.toLowerCase() === fuelType.toLowerCase()
  );

  if (price) {
    return {
      type: price.type,
      price: price.price,
      location: {
        lat: price.lat,
        lng: price.lng,
      },
    };
  }

  return undefined;
};
