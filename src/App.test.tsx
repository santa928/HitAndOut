import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("opens and closes the how to play guide from the title", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "遊び方" }));

    expect(screen.getByRole("dialog", { name: "遊び方" })).toHaveTextContent(
      "投手役がヒット位置を隠す",
    );

    await user.click(screen.getByRole("button", { name: "とじる" }));

    expect(
      screen.queryByRole("dialog", { name: "遊び方" }),
    ).not.toBeInTheDocument();
  });

  it("moves from title into the pitcher's hidden selection", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "2人であそぶ" }));

    const gameScreen = screen.getByLabelText("ゲーム画面");

    expect(
      within(gameScreen).getByText("PLAYER 2 が守備セット"),
    ).toBeInTheDocument();
    expect(
      within(gameScreen).getByLabelText("スコアボード"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1塁に隠す" })).toBeInTheDocument();
  });

  it("hides the selected location during the phone handoff", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "2人であそぶ" }));
    await user.click(screen.getByRole("button", { name: "1塁に隠す" }));

    expect(screen.getByText("PLAYER 1 に端末を渡す")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "1塁に隠す" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "PLAYER 1 の攻撃へ" }));

    expect(screen.getByText("PLAYER 1 がヒットの場所を読む")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2塁をねらう" })).toBeInTheDocument();
  });

  it("shows an out result and keeps the batter on the remaining guesses", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "2人であそぶ" }));
    await user.click(screen.getByRole("button", { name: "1塁に隠す" }));
    await user.click(screen.getByRole("button", { name: "PLAYER 1 の攻撃へ" }));
    await user.click(screen.getByRole("button", { name: "2塁をねらう" }));

    expect(screen.getByText("OUT!")).toBeInTheDocument();
    expect(screen.queryByText("OUT 1")).not.toBeInTheDocument();
    expect(screen.getByLabelText("1アウト")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "残りを読む" }));

    expect(screen.getByText("PLAYER 1 がヒットの場所を読む")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1塁をねらう" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2塁はアウト" })).toBeDisabled();
  });

  it("names the next defender during the side change and setup handoff", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "2人であそぶ" }));
    await user.click(screen.getByRole("button", { name: "1塁に隠す" }));
    await user.click(screen.getByRole("button", { name: "PLAYER 1 の攻撃へ" }));

    for (const guess of ["2塁をねらう", "3塁をねらう", "ホームをねらう"]) {
      await user.click(screen.getByRole("button", { name: guess }));
      await user.click(screen.getByRole("button", { name: /残りを読む|攻守交代へ/ }));
    }

    expect(screen.getByText("PLAYER 1 に端末を渡す")).toBeInTheDocument();
    expect(screen.getByText("PLAYER 1 守備セット")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "PLAYER 1 の守備セットへ" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "PLAYER 1 の守備セットへ" }),
    );

    expect(screen.getByText("PLAYER 1 が守備セット")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "1塁に隠す" }));

    expect(screen.getByText("PLAYER 2 に端末を渡す")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "PLAYER 2 の攻撃へ" }),
    ).toBeInTheDocument();
  });
});
