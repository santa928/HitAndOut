import {
  continueAfterResult,
  createMatch,
  revealBatterTurn,
  selectHitLocation,
  submitGuess,
} from "./passAndPlay";

describe("pass-and-play match", () => {
  it("starts every inning score as unplayed", () => {
    expect(createMatch().inningScores).toEqual([
      [null, null, null],
      [null, null, null],
    ]);
  });

  it("hides the selected hit location behind the handoff phase", () => {
    const selected = selectHitLocation(createMatch(), "third");

    expect(selected.phase).toBe("handoff-to-batter");
    expect(selected.secretHitLocation).toBe("third");
    expect(revealBatterTurn(selected).phase).toBe("batter-guess");
  });

  it("keeps the same hidden setup after a missed guess", () => {
    const state = revealBatterTurn(selectHitLocation(createMatch(), "first"));
    const result = submitGuess(state, "second");
    const next = continueAfterResult(result);

    expect(result.lastPlay).toMatchObject({ kind: "out", guess: "second" });
    expect(result.outs).toBe(1);
    expect(next.phase).toBe("batter-guess");
    expect(next.secretHitLocation).toBe("first");
    expect(next.revealedOutLocations).toEqual(["second"]);
  });

  it("adds a run to the active inning score", () => {
    const batterTurn = revealBatterTurn(selectHitLocation(createMatch(), "home"));
    const homeRun = submitGuess(batterTurn, "home");

    expect(homeRun.scores[0]).toBe(1);
    expect(homeRun.inningScores[0][0]).toBe(1);
  });

  it("changes sides after the third out", () => {
    const batterTurn = revealBatterTurn(selectHitLocation(createMatch(), "first"));
    const firstOut = continueAfterResult(submitGuess(batterTurn, "home"));
    const secondOut = continueAfterResult(submitGuess(firstOut, "second"));
    const thirdOut = continueAfterResult(
      submitGuess(secondOut, "third"),
    );

    expect(thirdOut.phase).toBe("side-change");
    expect(thirdOut.half).toBe("bottom");
    expect(thirdOut.offense).toBe(1);
    expect(thirdOut.outs).toBe(0);
    expect(thirdOut.inningScores[0][0]).toBe(0);
  });

  it("finishes in a draw after the bottom of the third when scores match", () => {
    let state = createMatch();

    for (let half = 0; half < 6; half += 1) {
      state = revealBatterTurn(selectHitLocation(state, "first"));

      for (const guess of ["home", "second", "third"] as const) {
        state = continueAfterResult(
          submitGuess(state, guess),
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
