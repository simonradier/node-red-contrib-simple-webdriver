import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { expect } from "chai";
import { waitForValue } from "../../../src/utils/wait-for";
chai.use(chaiAsPromised);
chai.should;

describe("waitFor", function () {
  it("should be possible to waitFor an expected value", async function () {
    let cpt = 1;
    const func = async (nb: number) => {
      cpt += nb;
      cpt++;
      cpt--;
      return cpt;
    };

    const test = await waitForValue(1500, 10000000, func, 1);
    expect(test).to.be.equals(10000000);
  });
});
