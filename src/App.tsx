import type { ReactElement } from "react";
import "./styles/game.css";

/**
 * Render the pass-and-play entrypoint before a match begins.
 */
export default function App(): ReactElement {
  return (
    <main className="game-shell">
      <section className="title-screen" aria-labelledby="game-title">
        <p className="eyebrow">PASS AND PLAY</p>
        <h1 id="game-title">HIT AND OUT</h1>
        <button type="button">2人であそぶ</button>
      </section>
    </main>
  );
}
