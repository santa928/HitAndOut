import type { ReactElement } from "react";
import scoreboardHousing from "../assets/scoreboard-housing.png";
import type { MatchState } from "../game/types";

interface ScoreboardProps {
  match: MatchState;
}

const INNINGS = [1, 2, 3] as const;

/**
 * Show inning-by-inning runs and outs on the stadium display.
 */
export function Scoreboard({ match }: ScoreboardProps): ReactElement {
  return (
    <header className="scoreboard" aria-label="スコアボード">
      <img
        alt=""
        aria-hidden="true"
        className="scoreboard__housing"
        src={scoreboardHousing}
      />
      <table aria-label="回別スコア" className="scoreboard__table">
        <colgroup>
          <col className="scoreboard__team-column" />
          {INNINGS.map((inning) => (
            <col className="scoreboard__score-column" key={inning} />
          ))}
          <col className="scoreboard__score-column" />
        </colgroup>
        <thead>
          <tr>
            <th aria-label="プレイヤー" className="scoreboard__corner" />
            {INNINGS.map((inning) => (
              <th className="scoreboard__inning-head" key={inning} scope="col">
                {inning}
              </th>
            ))}
            <th
              className="scoreboard__inning-head scoreboard__inning-head--runs"
              scope="col"
            >
              R
            </th>
          </tr>
        </thead>
        <tbody>
          {match.players.map((player) => (
            <tr
              className={`scoreboard__row scoreboard__row--${player.id}`}
              key={player.id}
            >
              <th className="scoreboard__player-name" scope="row">
                {player.name}
              </th>
              {INNINGS.map((inning) => {
                const score = match.inningScores[player.id][inning - 1];
                const isActive =
                  match.offense === player.id && match.inning === inning;

                return (
                  <td
                    aria-label={describeInningCell(
                      match,
                      player.name,
                      inning,
                      score,
                      isActive,
                    )}
                    className={`scoreboard__score-cell${
                      isActive ? " scoreboard__score-cell--active" : ""
                    }`}
                    key={inning}
                  >
                    {score}
                  </td>
                );
              })}
              <td
                aria-label={`${player.name} 合計 ${match.scores[player.id]}点`}
                className="scoreboard__run-cell"
              >
                {match.scores[player.id]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <span
        aria-label={`${match.outs}アウト`}
        className="scoreboard__outs"
        role="img"
      >
        {([0, 1, 2] as const).map((out) => (
          <i
            aria-hidden="true"
            className={out < match.outs ? "is-on" : ""}
            key={out}
          />
        ))}
      </span>
    </header>
  );
}

/**
 * Describe lit, finished, and unplayed inning cells for screen readers.
 */
function describeInningCell(
  match: MatchState,
  playerName: string,
  inning: 1 | 2 | 3,
  score: number | null,
  isActive: boolean,
): string {
  if (isActive) {
    return `${playerName} ${inning}回${match.half === "top" ? "表" : "裏"} 攻撃中`;
  }

  if (score === null) {
    return `${playerName} ${inning}回 未消化`;
  }

  return `${playerName} ${inning}回 ${score}点`;
}
