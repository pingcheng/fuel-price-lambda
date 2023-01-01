import nock from "nock";
import successResponse from "./fixtures/200.json";
import { getCheapestPrice } from "./projectZeroThree";

const prepareScope = () => {
  return nock("https://projectzerothree.info")
    .get("/api.php")
    .query({
      format: "json",
    })
    .reply(200, successResponse);
};

describe("test projectZeroThree", () => {
  describe("test getCheapestPrice", () => {
    test("should hit the correct URL", async () => {
      const scope = prepareScope();
      await getCheapestPrice("U91");
      scope.done();
    });

    test("should return the cheapest price object", async () => {
      prepareScope();
      const response = await getCheapestPrice("U91");
      expect(response).toEqual({
        type: "U91",
        price: 157.5,
        location: {
          lat: -32.5693881346,
          lng: 151.18002208931,
        },
      });
    });

    test("should return undefined when the fuel type is not found", async () => {
      prepareScope();
      const response = await getCheapestPrice("RANDOM");
      expect(response).toBeUndefined();
    });
  });
});
