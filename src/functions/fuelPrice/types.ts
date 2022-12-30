export type Price = {
  type: string;
  price: number;
  location: LatLng;
};

export type LatLng = {
  lat: number;
  lng: number;
};
