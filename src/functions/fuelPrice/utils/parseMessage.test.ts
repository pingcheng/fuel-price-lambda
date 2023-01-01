import {
  defaultMessage,
  parseMessage,
} from "@functions/fuelPrice/utils/parseMessage";

describe("test parseMessage", () => {
  test("test empty body", () => {
    const message = parseMessage("{}");
    expect(message).toEqual(defaultMessage);
  });
});
