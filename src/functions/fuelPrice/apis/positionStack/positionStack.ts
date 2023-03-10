import axios from "axios";
import { LatLng } from "@functions/fuelPrice/types";

const ENDPOINT_API = "http://api.positionstack.com";
const API_KEY = process.env.POSITION_STACK_API_KEY ?? "";

export const getAddress = async (
  position: LatLng
): Promise<string | undefined> => {
  console.log(`Start to call positionStack to parse`, position);
  const response = await axios.get(`${ENDPOINT_API}/v1/reverse`, {
    params: {
      access_key: API_KEY,
      query: `${position.lat},${position.lng}`,
      country: "AU",
      limit: 1,
    },
  });

  console.log("Received address info from positionStack", response.data);

  const addresses = response.data.data;

  if (addresses.length === 0) {
    return undefined;
  }

  const address = addresses[0];

  if (!addresses) {
    return undefined;
  }

  return `${address.name} ${address.locality} ${address.region_code} ${address.postal_code}`;
};
