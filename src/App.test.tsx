import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("moves from title into the pitcher's hidden selection", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "2人であそぶ" }));

    const gameScreen = screen.getByLabelText("ゲーム画面");

    expect(
      within(gameScreen).getByText("ヒットを隠す場所を選べ"),
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

    expect(screen.getByText("打者に端末をわたす")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "1塁に隠す" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "打者の画面へ" }));

    expect(screen.getByText("ヒットの場所を読め")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2塁をねらう" })).toBeInTheDocument();
  });

  it("shows an out result and keeps the batter on the remaining guesses", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "2人であそぶ" }));
    await user.click(screen.getByRole("button", { name: "1塁に隠す" }));
    await user.click(screen.getByRole("button", { name: "打者の画面へ" }));
    await user.click(screen.getByRole("button", { name: "2塁をねらう" }));

    expect(screen.getByText("OUT!")).toBeInTheDocument();
    expect(screen.queryByText("OUT 1")).not.toBeInTheDocument();
    expect(screen.getByLabelText("1アウト")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "残りを読む" }));

    expect(screen.getByText("ヒットの場所を読め")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1塁をねらう" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2塁はアウト" })).toBeDisabled();
  });
});
