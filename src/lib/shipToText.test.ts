import { describe, expect, it } from "vitest";
import { PO_BOX_RULE, STATE_RULE, ZIP_RULE, shipToProblem } from "./shipToText";

const good = {
  name: "Sandbox Hotel",
  line1: "1 Way",
  city: "Kansas City",
  state: "MO",
  postal_code: "64112",
};

describe("shipToProblem", () => {
  it("accepts a deliverable US street address", () => {
    expect(shipToProblem(good)).toBeNull();
    expect(
      shipToProblem({ ...good, state: " mo ", postal_code: "64112-1234" }),
    ).toBeNull();
  });
  it("names the first blank required field", () => {
    expect(shipToProblem({ ...good, name: "  " })).toBe(
      "Hotel or business name is required.",
    );
    expect(shipToProblem({ ...good, line1: "" })).toBe(
      "Address line 1 is required.",
    );
    expect(shipToProblem({ ...good, postal_code: " " })).toBe(
      "ZIP code is required.",
    );
  });
  it("applies the state, ZIP and country rules", () => {
    expect(shipToProblem({ ...good, state: "Missouri" })).toBe(STATE_RULE);
    expect(shipToProblem({ ...good, postal_code: "6411" })).toBe(ZIP_RULE);
    expect(shipToProblem({ ...good, country: "CA" })).toBe(
      "We ship within the United States today.",
    );
  });
  it("refuses a PO Box on either line", () => {
    expect(shipToProblem({ ...good, line1: "P.O. Box 12" })).toBe(PO_BOX_RULE);
    expect(shipToProblem({ ...good, line2: "po box 12" })).toBe(PO_BOX_RULE);
    expect(shipToProblem({ ...good, line1: "12 Boxwood Lane" })).toBeNull();
  });
});
