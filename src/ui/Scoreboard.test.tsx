import { render, screen } from "@testing-library/react";
import { createMatch } from "../game/passAndPlay";
import type { MatchState } from "../game/types";
import { Scoreboard } from "./Scoreboard";

describe("Scoreboard", () => {
  it("shows inning scores, an empty unplayed cell, and the active half inning", () => {
    const match: MatchState = {
      ...createMatch(),
      half: "bottom",
      offense: 1,
      defense: 0,
      scores: [2, 0],
      inningScores: [
        [2, null, null],
        [null, null, null],
      ],
    };

    const { container } = render(<Scoreboard match={match} />);

    expect(
      screen.getByRole("table", { name: "回別スコア" }),
    ).toBeInTheDocument();
    expect(screen.getByText("R")).toBeInTheDocument();
    expect(screen.getByLabelText("PLAYER 1 合計 2点")).toHaveTextContent("2");
    expect(screen.getByLabelText("PLAYER 1 2回 未消化")).toHaveTextContent("");
    expect(screen.getByLabelText("PLAYER 2 1回裏 攻撃中")).toHaveClass(
      "scoreboard__score-cell--active",
    );
    expect(container.querySelector(".scoreboard__housing")).toBeInTheDocument();
  });
});
