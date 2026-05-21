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
      <strong>
        {match.inning}回{match.half === "top" ? "表" : "裏"}
      </strong>
      <span>
        {match.players[0].name} {match.scores[0]} - {match.scores[1]}{" "}
        {match.players[1].name}
      </span>
      <span>攻撃 {match.players[match.offense].name}</span>
      <span>OUT {match.outs}</span>
    </header>
  );
}
