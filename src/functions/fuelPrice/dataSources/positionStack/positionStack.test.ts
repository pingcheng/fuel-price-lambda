import nock from "nock";
import successResponse from "./fixtures/200.json";
import { getAddress } from "./positionStack";

const prepareScope = () => {
  return nock("http://api.positionstack.com")
    .get("/v1/reverse")
    .query({
      access_key: "",
      query: "-32.5693881346,151.18002208931",
      country: "AU",
    })
    .reply(200, successResponse);
};

describe("test positionStack", () => {
  describe("test getAddress", () => {
    test("should hit the correct URL", async () => {
      const scope = prepareScope();
      await getAddress({
        lat: -32.5693881346,
        lng: 151.18002208931,
      });
      scope.done();
    });

    test("should return the address string from the first item", async () => {
      prepareScope();
      const address = await getAddress({
        lat: -32.5693881346,
        lng: 151.18002208931,
      });
      expect(address).toBe("2-16 Orchard Avenue Singleton NSW 2330");
    });
  });
});
