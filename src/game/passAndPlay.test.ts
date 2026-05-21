import {
  continueAfterResult,
  createMatch,
  revealBatterTurn,
  selectHitLocation,
  submitGuess,
} from "./passAndPlay";

describe("pass-and-play match", () => {
  it("hides the selected hit location behind the handoff phase", () => {
    const selected = selectHitLocation(createMatch(), "third");

    expect(selected.phase).toBe("handoff-to-batter");
    expect(selected.secretHitLocation).toBe("third");
    expect(revealBatterTurn(selected).phase).toBe("batter-guess");
  });

  it("adds an out for a missed guess and returns to pitcher selection", () => {
    const state = revealBatterTurn(selectHitLocation(createMatch(), "first"));
    const result = submitGuess(state, "second");
    const next = continueAfterResult(result);

    expect(result.lastPlay).toMatchObject({ kind: "out", guess: "second" });
    expect(result.outs).toBe(1);
    expect(next.phase).toBe("pitcher-select");
    expect(next.secretHitLocation).toBeNull();
  });

  it("changes sides after the third out", () => {
    const firstOut = continueAfterResult(
      submitGuess(
        revealBatterTurn(selectHitLocation(createMatch(), "first")),
        "home",
      ),
    );
    const secondOut = continueAfterResult(
      submitGuess(
        revealBatterTurn(selectHitLocation(firstOut, "second")),
        "home",
      ),
    );
    const thirdOut = continueAfterResult(
      submitGuess(
        revealBatterTurn(selectHitLocation(secondOut, "third")),
        "home",
      ),
    );

    expect(thirdOut.phase).toBe("side-change");
    expect(thirdOut.half).toBe("bottom");
    expect(thirdOut.offense).toBe(1);
    expect(thirdOut.outs).toBe(0);
  });

  it("finishes in a draw after the bottom of the third when scores match", () => {
    let state = createMatch();

    for (let half = 0; half < 6; half += 1) {
      for (const hitLocation of ["first", "second", "third"] as const) {
        state = continueAfterResult(
          submitGuess(
            revealBatterTurn(selectHitLocation(state, hitLocation)),
            "home",
          ),
        );
      }

      if (state.phase === "side-change") {
        state = { ...state, phase: "pitcher-select" };
      }
    }

    expect(state.phase).toBe("game-over");
    expect(state.winner).toBe("draw");
  });
});
