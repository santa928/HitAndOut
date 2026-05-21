import type { ReactElement } from "react";
import type { MatchState } from "../game/types";

interface ScoreboardProps {
  match: MatchState;
}

/**
 * Keep inning, score, offense, and outs visible during every turn.
 */
export function Scoreboard({ match }: ScoreboardProps): ReactElement {
  return (
    <header className="scoreboard" aria-label="スコアボード">
      <b className="scoreboard__title">
        <span>HIT</span> AND <em>OUT</em>
      </b>
      <strong className="scoreboard__inning">
        {match.inning}回{match.half === "top" ? "表" : "裏"}
      </strong>
      <span className="scoreboard__player scoreboard__player--one">
        <small>{match.players[0].name}</small>
        <b>{match.scores[0]}</b>
      </span>
      <span className="scoreboard__offense">
        攻撃
        <i aria-hidden="true" className={match.offense === 0 ? "is-left" : ""} />
      </span>
      <span className="scoreboard__player scoreboard__player--two">
        <small>{match.players[1].name}</small>
        <b>{match.scores[1]}</b>
      </span>
      <span className="scoreboard__outs">
        <b className="scoreboard__out-count">OUT {match.outs}</b>
        {([0, 1, 2] as const).map((out) => (
          <i className={out < match.outs ? "is-on" : ""} key={out} />
        ))}
      </span>
    </header>
  );
}
