import { advanceRunners } from "./rules";
import type { Bases } from "./types";

describe("advanceRunners", () => {
  it("puts the batter on first for a first-base hit", () => {
    expect(advanceRunners(emptyBases(), "first")).toEqual({
      bases: { first: true, second: false, third: false },
      runs: 0,
      distance: 1,
    });
  });

  it("scores a runner from second on a second-base hit", () => {
    expect(
      advanceRunners({ first: false, second: true, third: false }, "second"),
    ).toEqual({
      bases: { first: false, second: true, third: false },
      runs: 1,
      distance: 2,
    });
  });

  it("clears all bases and scores every runner on a home hit", () => {
    expect(
      advanceRunners({ first: true, second: true, third: true }, "home"),
    ).toEqual({
      bases: { first: false, second: false, third: false },
      runs: 4,
      distance: 4,
    });
  });
});

function emptyBases(): Bases {
  return { first: false, second: false, third: false };
}
