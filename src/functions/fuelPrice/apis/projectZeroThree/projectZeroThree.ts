import { Price } from "@functions/fuelPrice/types";
import axios from "axios";

const ENDPOINT_URL = "https://projectzerothree.info/api.php?format=json";

export const getCheapestPrice = async (
  fuelType: string
): Promise<Price | undefined> => {
  const response = await axios.get(ENDPOINT_URL);
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
