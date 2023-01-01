export type Price = {
  type: string;
  price: number;
  location: LatLng;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type Destination = {
  url: string;
  method: "get" | "post" | "put" | "delete";
};

export type FuelPriceMessage = {
  destination: Destination;
  data: {
    fuelType: string;
    publicMessage: boolean;
    userId?: string;
  };
};
