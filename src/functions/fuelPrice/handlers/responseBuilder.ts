export const buildResponse = (price: Price, address: string): string => {
    const lines = [];

    lines.push(`Found the lowest address!`);
    lines.push(`:moneybag: $${price.price.toFixed(2)}`);
    lines.push(`:round_pushpin: ${address}`);

    return lines.join("\n");
}