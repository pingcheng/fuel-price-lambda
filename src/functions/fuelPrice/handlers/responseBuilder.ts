export const buildResponse = (price: Price, address: string): string => {
  const lines = [];

  lines.push(`:sunglasses: Found the lowest address!`);
  lines.push(`:fuelpump: ${price.type}`);
  lines.push(`:moneybag: $${price.price.toFixed(2)}`);
  lines.push(`:round_pushpin: ${address}`);
  lines.push(`:world_map: ${price.location.lat}, ${price.location.lng}`);

  return lines.join("\n");
};
