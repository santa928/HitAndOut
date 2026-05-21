import { useState, type ReactElement } from "react";
import {
  continueAfterResult,
  createMatch,
  revealBatterTurn,
  selectHitLocation,
  submitGuess,
} from "./game/passAndPlay";
import type { HitLocation, MatchState } from "./game/types";
import "./styles/game.css";
import { Diamond } from "./ui/Diamond";
import { PassScreen } from "./ui/PassScreen";
import { ResultBanner } from "./ui/ResultBanner";
import { Scoreboard } from "./ui/Scoreboard";

/**
 * Render the pass-and-play match flow for the shared-device version.
 */
export default function App(): ReactElement {
  const [match, setMatch] = useState<MatchState | null>(null);

  if (!match) {
    return (
      <main className="game-shell">
        <section className="title-screen" aria-labelledby="game-title">
          <p className="eyebrow">PASS AND PLAY</p>
          <h1 id="game-title">HIT AND OUT</h1>
          <button onClick={() => setMatch(createMatch())} type="button">
            2人であそぶ
          </button>
        </section>
      </main>
    );
  }

  const pickHiddenLocation = (location: HitLocation): void => {
    setMatch((current) =>
      current ? selectHitLocation(current, location) : current,
    );
  };

  const submitBatterGuess = (location: HitLocation): void => {
    setMatch((current) => (current ? submitGuess(current, location) : current));
  };

  const continuePlay = (): void => {
    setMatch((current) => (current ? continueAfterResult(current) : current));
  };

  const startNextHalf = (): void => {
    setMatch((current) =>
      current?.phase === "side-change"
        ? { ...current, phase: "pitcher-select" }
        : current,
    );
  };

  const boardMode =
    match.phase === "pitcher-select"
      ? "pitcher"
      : match.phase === "batter-guess"
        ? "batter"
        : "read-only";

  return (
    <main className="game-shell game-shell--match">
      <section
        aria-label="ゲーム画面"
        className={`match-screen match-screen--${match.phase}`}
      >
        <Diamond
          bases={match.bases}
          mode={boardMode}
          onPick={boardMode === "pitcher" ? pickHiddenLocation : submitBatterGuess}
          revealedOutLocations={match.revealedOutLocations}
        >
          <Scoreboard match={match} />

          {match.phase === "pitcher-select" ? (
            <TurnPrompt
              headline="ヒットを隠す場所を選べ"
              role={`${match.players[match.defense].name} PITCHING`}
            />
          ) : null}

          {match.phase === "batter-guess" ? (
            <TurnPrompt
              headline="ヒットの場所を読め"
              role={`${match.players[match.offense].name} BATTING`}
            />
          ) : null}

          {match.phase === "handoff-to-batter" ? (
            <PassScreen onContinue={() => setMatch(revealBatterTurn(match))} />
          ) : null}

          {match.phase === "result" ? (
            <ResultBanner match={match} onContinue={continuePlay} />
          ) : null}

          {match.phase === "side-change" ? (
            <section className="change-screen">
              <p className="result-word result-word--change">CHANGE!</p>
              <button onClick={startNextHalf} type="button">
                次の攻撃へ
              </button>
            </section>
          ) : null}

          {match.phase === "game-over" ? (
            <section className="game-over-screen">
              <p className="eyebrow">FINAL</p>
              <h2>{describeWinner(match)}</h2>
              <button onClick={() => setMatch(createMatch())} type="button">
                もう一試合
              </button>
              <button onClick={() => setMatch(null)} type="button">
                タイトルへ
              </button>
            </section>
          ) : null}
        </Diamond>
      </section>
    </main>
  );
}

/**
 * Show the active player instruction inside the stadium HUD.
 */
function TurnPrompt({
  headline,
  role,
}: {
  headline: string;
  role: string;
}): ReactElement {
  return (
    <section className="turn-prompt" aria-live="polite">
      <p>{role}</p>
      <h2>{headline}</h2>
    </section>
  );
}

function describeWinner(match: MatchState): string {
  if (match.winner === "draw") {
    return "DRAW GAME";
  }

  if (match.winner === null) {
    return "FINAL SCORE";
  }

  return `${match.players[match.winner].name} WIN`;
}
