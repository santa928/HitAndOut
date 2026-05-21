import type { ReactElement } from "react";
import type { MatchState } from "../game/types";

interface ResultBannerProps {
  match: MatchState;
  onContinue: () => void;
}

/**
 * Show the short play result before the next pitcher selection or side change.
 */
export function ResultBanner({
  match,
  onContinue,
}: ResultBannerProps): ReactElement {
  const label = match.lastPlay?.kind === "hit" ? "HIT!" : "OUT!";
  const continueLabel =
    match.lastPlay?.kind === "hit"
      ? "次の勝負へ"
      : match.outs < 3
        ? "残りを読む"
        : "チェンジへ";
  const call =
    match.lastPlay?.kind === "hit"
      ? "ランナーが進む!"
      : match.outs < 3
        ? "読みを続けろ!"
        : "3 OUT CHANGE!";

  return (
    <section className="result-banner" aria-live="polite">
      <p className={`result-word result-word--${match.lastPlay?.kind}`}>{label}</p>
      <p className="result-banner__call">{call}</p>
      <button onClick={onContinue} type="button">
        {continueLabel}
      </button>
    </section>
  );
}
