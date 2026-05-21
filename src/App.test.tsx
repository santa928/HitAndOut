import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("shows the pass-and-play title action", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: "2人であそぶ" }),
    ).toBeInTheDocument();
  });
});
