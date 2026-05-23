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
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  if (!match) {
    return (
      <main className="game-shell">
        <section className="title-screen" aria-labelledby="game-title">
          <p className="eyebrow">PASS AND PLAY</p>
          <h1 id="game-title">HIT AND OUT</h1>
          <div className="title-screen__actions">
            <button onClick={() => setMatch(createMatch())} type="button">
              2人であそぶ
            </button>
            <button
              className="title-screen__guide-button"
              onClick={() => setIsHowToPlayOpen(true)}
              type="button"
            >
              遊び方
            </button>
          </div>
        </section>

        {isHowToPlayOpen ? (
          <section
            aria-labelledby="how-to-play-title"
            aria-modal="true"
            className="how-to-play"
            role="dialog"
          >
            <div className="how-to-play__panel">
              <p className="eyebrow">PASS AND PLAY</p>
              <h2 id="how-to-play-title">遊び方</h2>
              <ol>
                <li>投手役がヒット位置を隠す。</li>
                <li>端末を相手へ渡す。</li>
                <li>打者役がヒット位置を読む。</li>
                <li>アウトなら残りを読み、ヒットなら進塁。</li>
                <li>3イニングの得点で勝負。</li>
              </ol>
              <button onClick={() => setIsHowToPlayOpen(false)} type="button">
                とじる
              </button>
            </div>
          </section>
        ) : null}
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

  const startNextDefenseSetup = (): void => {
    setMatch((current) =>
      current?.phase === "handoff-to-defender"
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
  const offenseName = match.players[match.offense].name;
  const defenseName = match.players[match.defense].name;

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
              detail={`${offenseName} に見せずヒット位置を隠す`}
              headline={`${defenseName} が守備セット`}
              playerIndex={match.defense}
              role={`${defenseName} DEFENSE`}
              tone="defense"
            />
          ) : null}

          {match.phase === "batter-guess" ? (
            <TurnPrompt
              detail={`${defenseName} のセットを読む`}
              headline={`${offenseName} がヒットの場所を読む`}
              playerIndex={match.offense}
              role={`${offenseName} BATTING`}
              tone="offense"
            />
          ) : null}

          {match.phase === "handoff-to-batter" ? (
            <PassScreen
              batterIndex={match.offense}
              batterName={offenseName}
              defenderIndex={match.defense}
              defenderName={defenseName}
              onContinue={() => setMatch(revealBatterTurn(match))}
            />
          ) : null}

          {match.phase === "handoff-to-defender" ? (
            <DefenderHandoffScreen match={match} onContinue={startNextDefenseSetup} />
          ) : null}

          {match.phase === "result" ? (
            <ResultBanner match={match} onContinue={continuePlay} />
          ) : null}

          {match.phase === "side-change" ? (
            <ChangeScreen match={match} onContinue={startNextHalf} />
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
  detail,
  headline,
  playerIndex,
  role,
  tone,
}: {
  detail?: string;
  headline: string;
  playerIndex: number;
  role: string;
  tone: "defense" | "offense";
}): ReactElement {
  return (
    <section
      className={`turn-prompt turn-prompt--${tone} player-color--${playerIndex}`}
      aria-live="polite"
    >
      <p className={`player-color--${playerIndex}`}>{role}</p>
      <h2 className={`player-color--${playerIndex}`}>{headline}</h2>
      {detail ? <span className="turn-prompt__detail">{detail}</span> : null}
    </section>
  );
}

/**
 * Make the side-change handoff explicit before the next hidden setup begins.
 */
function ChangeScreen({
  match,
  onContinue,
}: {
  match: MatchState;
  onContinue: () => void;
}): ReactElement {
  const offenseName = match.players[match.offense].name;
  const defenseName = match.players[match.defense].name;

  return (
    <section className="change-screen" aria-live="polite">
      <div className="change-screen__relay">
        <p className="change-screen__eyebrow">CHANGE!</p>
        <p className={`change-screen__handoff player-color--${match.defense}`}>
          {defenseName} に端末を渡す
        </p>
        <div className="change-screen__roles">
          <p className={`player-color--${match.defense}`}>
            <span>守備</span>
            <b>{defenseName}</b>
          </p>
          <p className={`player-color--${match.offense}`}>
            <span>攻撃</span>
            <b>{offenseName}</b>
          </p>
        </div>
        <p className={`change-screen__next player-color--${match.defense}`}>
          {defenseName} 守備セット
        </p>
      </div>
      <button onClick={onContinue} type="button">
        {defenseName} の守備セットへ
      </button>
    </section>
  );
}

/**
 * Tell the batter to return the phone before the defender hides the next hit.
 */
function DefenderHandoffScreen({
  match,
  onContinue,
}: {
  match: MatchState;
  onContinue: () => void;
}): ReactElement {
  const offenseName = match.players[match.offense].name;
  const defenseName = match.players[match.defense].name;

  return (
    <section className="defender-handoff-screen" aria-live="polite">
      <div className="defender-handoff-screen__panel">
        <p className="defender-handoff-screen__eyebrow">NEXT SETUP</p>
        <p className={`defender-handoff-screen__handoff player-color--${match.defense}`}>
          {defenseName} に端末を渡す
        </p>
        <p className={`defender-handoff-screen__next player-color--${match.defense}`}>
          {defenseName} 守備セット
        </p>
        <p className="defender-handoff-screen__detail">
          {offenseName} は画面を見ずに待つ
        </p>
      </div>
      <button onClick={onContinue} type="button">
        {defenseName} の守備セットへ
      </button>
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
