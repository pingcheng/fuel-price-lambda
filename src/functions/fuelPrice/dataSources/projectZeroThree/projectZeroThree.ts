import { Price } from "@functions/fuelPrice/types";
import axios from "axios";

const ENDPOINT_URL = "https://projectzerothree.info/api.php?format=json";

export const getCheapestPrice = async (): Promise<Price | undefined> => {
  const response = await axios.get(ENDPOINT_URL);
  const regionAll = response.data.regions.find(
    (region) => region.region === "All"
  );
  const u91Price = regionAll.prices.find((price) => price.type === "U91");

  if (u91Price) {
    return {
      type: u91Price.type,
      price: u91Price.price,
      location: {
        lat: u91Price.lat,
        lng: u91Price.lng,
      },
    };
  }

  return undefined;
};
